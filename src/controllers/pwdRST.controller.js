import Users from '../models/Users';
import pwdRST from "../models/pwdRST";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';

import { Tools } from "../middleware/index";

let hash_pwdRST = '';
let pwdRST_id = '';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true,
        auth: {
          user: 'ricardogueta@gmail.com',
          pass : 'rzisnbjgkysuwksc'
        }
});


// #region html layout ---------------------------------------
let html_call = '';

// #endregion html layout ---------------------------------------

export const pwdRSTReq = async (req,res) => {
    console.log('pwdRSTReq params ---> ', req.params);
    console.log('images_root -->',`${process.env.images_root}`)

    let foundUser = await Users.find({email : req.params.email});

    try{

        console.log('foundUser ---->  ',foundUser);
        
        if(!foundUser.length) return res.status(400).json({'message': 'User not found'});

        // #region save on DB   ------------------------------
        
        const newPwdRST = new pwdRST({email:req.params.email,confirmed:false,reseted:false});
        newPwdRST.save(async (err, pwdRST_saved) => {
            if(err) return res.status(400).json({'message': 'Error can not saved pwdRST'});
            pwdRST_id = await pwdRST_saved._id;
            console.log('pwdRST_saved id -->', pwdRST_saved._id);


         createHTML();

        const mailOption = await {
            from : 'byh16@gmail.com',
            to : req.params.email,
            subject : 'Pssword reset',
            html : html_call
        }
        
        await transporter.sendMail(mailOption, (err, info) =>{
            if(err){
                console.log(err)
                res.status(201).json({'pwd rst error': err})
            }else{
                console.log('Email sent: ', info.response);
                res.status(201).json({'email sent': info.response})
            }
        });

        });


        // hash_pwdRST = await Tools.encrypt(req.params.email);
        // const hash_pwdRST_decrypted = await Tools.decrypt(hash_pwdRST);
        // console.log('hash pwdRST --> ' + JSON.stringify(hash_pwdRST) + '\n decode --> ' + hash_pwdRST_decrypted);

        // #endregion  -----------------------------------------

        
        // console.log('pwd RST Req ..... --> ', req.params);


        

        res.status('201').json({'message': 'email sent , hash --> ' + hash_pwdRST})

    }catch(e){
        console.log('error pwdRSTReq -----> ' , e);
        res.status('401').json({'pwdRSTReq error' : e.message})
    }
    
}


export const pwdRSTConfirm = async (req, res) => {

    const foundpwdRST  = await pwdRST.find({_id : req.params.id});
    if(!foundpwdRST.length) return res.status(400).json({'error' : 'No hay solicitud para este usuario'});

    const foundUser = await Users.findOne({email : foundpwdRST[0].email});
    if(!foundUser) return res.status(400).json({'error' : 'User not found'});

    pwdRST.findByIdAndUpdate(req.params.id,{$set : {confirmed : true}},{new:false}, (err, resultConfirmed) => {
        if(err){
            return res.status(400).json({'error' : 'Could not update reseted.'});
        }
    });

    res.status(201).json({'msg':'Password reset confirmation for [ ' + foundUser.email + ' ]' });

}


export const pwdRSTApply = async (req, res) => {
    console.log('Password RST confirmed..! ', req.params);

   const foundpwdRST  = await pwdRST.find({_id : req.params.id});
   if(!foundpwdRST.length) return res.status(400).json({'error' : 'No hay solicitud para este usuario'});

   try{
        const foundUser = await Users.findOne({email : foundpwdRST[0].email});
        if(!foundUser) return res.status(400).json({'error' : 'User not found'});

        const Encryptedpwd = await encryptPassword(req.params.pwd);
        if(!Encryptedpwd) return res.status(400).json({'error' : 'No password encrypted.'});

        Users.findOneAndUpdate({email:foundpwdRST[0].email}, {$set : {pwd:Encryptedpwd}},{new:false},(err, result) =>{
            if(err){
                return res.status(400).json({'error' : 'Could not update password.'});
            }
            
            console.log('userPwdChanged -- > ',result);

            pwdRST.findByIdAndUpdate(req.params.id,{$set : {reseted : true}},{new:false}, (err, resultReseted) => {
                if(err){
                    return res.status(400).json({'error' : 'Could not update reseted.'});
                }
            });
    
            res.status(201).json({'msg':'Password changed for [' + foundUser.email + '], encrypted pwd --> ' + Encryptedpwd });


        })

       
        // const updPwdRST = pwdRST.updateOne()
   }catch(e){
    res.status(401).json({'Error': e});
    }
}
// #region create HTML layout   -------------------------------------------------------

async function encryptPassword(pwd){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pwd,salt);
}

async function createHTML(){
   html_call =
    `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset='utf-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <title>Recupera contraseña</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <style>
                body {margin:15vh 20vw}
                a {display:flex; justify-content: center; align-items: center; margin-left: auto; margin-right: auto; height: 30px;
                    width: 200px;text-decoration: none;}
                a input {cursor: pointer; display:inline;background-color:#6599CE;border:0;color:white; margin-left: auto;
                    margin-right: auto;height: 30px; width: 200px; border-radius: 10px}
                .logo img {height: 90px; width: 100px; border-radius: 50%;}
            </style>
        </head>
        <body>
            <div class="head">
                <div class="logo">
                    <img src=${process.env.images_root}logo_v2.png>
                </div>
            </div>
            <h3>Reinicio de contraseña</h3>
            <p>Hola !</p>
            <p>Hemos recibido una solicitud de reinicio de contraseña para tu cuenta, 
                con gusto te ayudaremos con tu solicitud, para continuar con este proceso haz click 
                en el siguiente boton
            </p>
            <a href=${process.env.public_host}pwdResetReq?req=${pwdRST_id} target='#'>
                <input type="button" value="RESET PASSWORD">
            </a>
            <p>
                Si no quieres reiniciar tu contraseña, tan solo ignora este correo y accesa a nuestros aervicios 
                como usualmente lo haces.
            </p>
        </body>
       
    </html>
    `
}

// #endregion create HTML layout   -------------------------------------------------------
