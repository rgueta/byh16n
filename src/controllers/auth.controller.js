import Users from '../models/Users';
import jwt from 'jsonwebtoken';
import Roles from '../models/Roles';


export const signUp = async (req, res) => {
    const { name,email,username,pwd,core,house,sim,gender,avatar,roles} = req.body;

    const newUser = new Users({
        name,
        email,
        username,
        core,
        house,
        sim,
        gender,
        avatar,
        roles,
        pwd : await Users.encryptPassword(pwd)
    });

    if(roles){
        const foundRoles = await Roles.find({name : {$in : roles}});
        newUser.roles = foundRoles.map(role => role._id);
    }else{
        const role = await Roles.findOne({name:'visitor'});
        newUser.roles = [role._id];
    }
    

    const savedUser = await newUser.save();
    const token = jwt.sign({id : savedUser._id},process.env.SECRET,{
        expiresIn:process.env.token_time
    });


    console.log(savedUser);
    res.status(200).json({'token':token});
}


export const signIn = async (req, res) => {

    console.log('email:  --> ' + req.body.email + ', pwd : ' + req.body.pwd + ' encrypted -->  ' + await Users.encryptPassword(req.body.pwd));

    try{
        await Users.aggregate([
            {
                $match : {
                    email : String(req.body.email)
                }
            },
            {
                $lookup : {
                        'from' : 'cores',
                        'localField' : 'core',
                        'foreignField' : '_id',
                        'as' : 'user_core'
                    }
            },
            {$unwind : '$user_core'},

            {
                $lookup: {
                        'from': 'cpus', 
                        'localField': 'user_core.cpuId', 
                        'foreignField': '_id', 
                        'as': 'user_cpu'
                        }
            }, { '$unwind': '$user_cpu' }, 
            {
                $lookup: {
                        'from': 'states', 
                        'localField': 'user_cpu.stateId', 
                        'foreignField': '_id', 
                        'as': 'cpu_state'
                        }
            },{'$unwind':  '$cpu_state'}, 
            {
                $lookup: {
                        'from': 'countries', 
                        'localField': 'user_cpu.countryId', 
                        'foreignField': '_id', 
                        'as': 'cpu_country'
                        }
            }, {'$unwind': '$cpu_country' }, 
            {
                $lookup: {
                        'from': 'divisions', 
                        'localField': 'user_core.divisionId', 
                        'foreignField': '_id', 
                        'as': 'user_division'
                        }
            }, {'$unwind': '$user_division' }, 
            {
                $lookup: {
                        'from': 'cities', 
                        'localField': 'user_cpu.cityId', 
                        'foreignField': '_id', 
                        'as': 'cpu_city'
                        }
            }, { '$unwind': '$cpu_city' },
            {
                $lookup : {
                        'from' : 'roles',
                        'localField' : 'roles',
                        'foreignField' : '_id',
                        'as' : 'user_roles'
                    } 
            },
            {
                $project: {
                    _id : 1,
                name: 1,
                sim : 1,
                pwd:1,
                coreName : '$user_core.name',
                coreSim : '$user_core.Sim',
                email: 1,
                roles: '$user_roles',
                location: 1,
                country: '$cpu_country.shortName', 
                state: '$cpu_state.state', 
                city: '$cpu_city.shortName', 
                div: '$user_division.id', 
                cpu: '$user_cpu.shortName', 
                core: '$user_core.shortName',
                code_expiry: '$user_core.code_expiry'
                //   img_folder: {$concat : [ '$cpu_country.shortName', '.' ,
                //                 '$user_cpu.state', '.' ,
                //                 '$cpu_city.shortName', '.' ,
                //                 {$toString : '$user_division.id'} , '.' ,
                //                 '$user_cpu.shortName', '.' ,
                //                 '$user_core.shortName']}
            
                }
            }
            
        ],async function(err, foundUser) {
            if(err || foundUser == '') return res.status(400).json({'errId':1,'ErrMsg':"Usuario no encontrado","Error": err});

            console.log('Signin foundUser -- > ', foundUser)
            const matchPwd =  await Users.comparePassword(req.body.pwd,foundUser[0].pwd);


            if(!matchPwd) return res.status(400).json({token:'', ErrMsg:'Invalid password'});

            // Create tokens  ------------------------
           jwt.sign({id:foundUser[0]._id}, process.env.SECRET,
            {
                expiresIn: process.env.token_time
            },async (err, token) => {

                // Error manage
                if(err){
                    console.log('Error --> ',err)
                    
                    return res.status(400).json(err.message)
                }

                const decode = jwt.decode(token,process.env.SECRET)

                // //--- Dates Access token
                let expDate = await new Date(decode.exp * 1000);
                let iatDate = await new Date(decode.iat * 1000);

                await expDate.setMinutes(expDate.getMinutes() - expDate.getTimezoneOffset());
                await iatDate.setMinutes(iatDate.getMinutes() - iatDate.getTimezoneOffset());
                
                const refreshToken = jwt.sign({id:foundUser[0]._id}, process.env.SECRET_REFRESH,{
                    expiresIn: process.env.refresh_token_time
                });

                if(!token) return res.status(401).json({'token' : '', message : 'Something goes wrong'});

                return res.status(201).json({'accessToken' : token ,'refreshToken': refreshToken,'userId' : foundUser[0]._id,
                'roles': foundUser[0].roles,'sim':foundUser[0].sim,  'core_sim':foundUser[0].coreSim, 
                'coreName' : foundUser[0].coreName, 'location':foundUser[0].location, 'code_expiry': foundUser[0].code_expiry,'iatDate': iatDate, 'expDate': expDate});

            });

        });
    }catch(err){
        return res.status(400).json({'msg': 'Something wrong with server'})
    }
}


export const refresh = async (req, res, next) =>{
    await console.log('\r\n---------------  Refresh token   ---------------------');
    let token = await req.header('authorization');
    token = await  token.replace('Bearer ','');
    let refToken = '';

    console.log('Este es el token -->', token);

    if(!token || typeof token === 'undefined' || token === ''){
        return res.status(400).json({'message' : 'Something goes wrong.'});
     }else{

        try{
            

            const refTokenDecode = await jwt.decode(token,process.env.SECRET_REFRESH);
            let dateExp = await new Date(refTokenDecode.exp * 1000);

            console.log('refresh expiry --> ', dateExp.setMinutes(dateExp.getMinutes() - dateExp.getTimezoneOffset()))
            
            const DateNow = new Date();
            
            console.log('Now --> ', DateNow.setMinutes(DateNow.getMinutes() - DateNow.getTimezoneOffset()));



            jwt.verify(token, process.env.SECRET_REFRESH, async (err, tokenDecode) => {
                if(err) {
                    // renew refresh token---------------------
                    await console.log('---------------  Renew refresh token   ---------------------');
                    await jwt.sign({id:refTokenDecode.id}, process.env.SECRET_REFRESH,
                        {
                            expiresIn: process.env.refresh_token_time   
                        }, async (err,refreshToken) => {
                        if(err) return res.state(400).json({'msg' : 'new refresh faild'});

                        refToken = await refreshToken;
                    })

                }

                // Create access token  ------------------------
                await jwt.sign({id:refTokenDecode.id}, process.env.SECRET,
                    {
                        expiresIn: process.env.token_time
                    },async (err, token) => {
        
                        // Error manage
                        if(err){
                            return res.status(400).json({'Something goes wrong':err.message});
                        }

                        //--- Decode and Dates Access token
                        const decode = await jwt.decode(token,process.env.SECRET);
                    
                        let expDate = await new Date(decode.exp * 1000);
                        let iatDate = await new Date(decode.iat * 1000);
        
                        await expDate.setMinutes(expDate.getMinutes() - expDate.getTimezoneOffset());
                        await iatDate.setMinutes(iatDate.getMinutes() - iatDate.getTimezoneOffset());
                        
                        
                        res.status(200).json({'userId': refTokenDecode.id,'accessToken' : token, 
                        'refreshToken' : refToken, 'iatDate':iatDate, 'expDate': expDate});
                        next();
                    });

            });

        }catch(e){
            console.log('refresh Token catch error ! --> ',e);
            return res.status(400).json({'message' : 'Something goes wrong.' + e});
        }
     }
}