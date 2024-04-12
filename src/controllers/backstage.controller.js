import Users  from "../models/Users";
import backstage from "../models/backstage";
import {Schema, Types} from 'mongoose';

export const createBackstage = async (req,res) =>{
    console.log(req.body);


    const  {name,email,username,house,
        uuid,sim,gender, note} = await req.body;

    const cpu =  new Types.ObjectId(req.body.cpu);
    const core = new Types.ObjectId(req.body.core);

    try{

        // Find this email in users collection
        const foundStage = await backstage.findOne({email : req.body.email});

        if(foundStage){
            console.log('backstage already exists -> ' + JSON.stringify(foundStage));
            res.status(303).send({'status' : 303, 'msg' : 'Ya existe peticion para este correo'});
            return;
        }

        // Find this email in users collection
        const foundUser = await Users.findOne({email : req.body.email});

        if(!foundUser){
            const newBackstage = await new backstage({cpu,core,name,username,
                email,sim,house,uuid,gender,note});

            const backstageSaved = await newBackstage.save();
            res.status(200).send({'status' : 200,'msg' : 'Backstage saved',
                'result': backstageSaved});

        }else{
            console.log('User already exists -> ' + JSON.stringify(foundUser));
            res.status(304).send({'status' : 304, 'msg' : 'User already exists'});
            return;
        }
            
    }catch(err){
        console.log('Error: ', err.message);
        return res.status(401).send({'status' : 401, 'msg':err.message});
    }
}

export const getBackstage = async (req, res) => {
    try{
      await backstage.aggregate([
            {
                $lookup:
                {
                    from: "cpus",
                    localField: "cpu",
                    foreignField: "_id",
                    as: "cpus",
                }
            },
            { $unwind:{path: "$cpus" } },
            {
                $lookup: {
                    from: "cores",
                    localField: "core",
                    foreignField: "_id",
                    as: "cores",
                }
            },
            { $unwind: {path: "$cores" } },
            {
                $project: {
                    cpu: 1,
                    core : 1,
                    cpuName: "$cpus.name",
                    coreName: "$cores.name",
                    coreSim: "$cores.Sim",
                    name : 1,
                    username: 1,
                    house : 1,
                    email: 1,
                    sim: 1,
                    uuid: 1,
                    gender: 1,
                    path: { $concat : ["$cores.country", "." , "$cores.state",
                         "." ,"$cores.city", ".", 
                        {$toString : "$cores.division" }, 
                         "." ,"$cores.cpu", "." , "$cores.shortName"]},
                    note: 1,
                    updatedAt: {
                    $dateToString: {
                        format: "%Y/%m/%d %H:%M:%S",
                        date: "$updatedAt",
                        timezone: "America/Los_Angeles",
                        }
                    }
                }
            }
        
        ], async (err, result) => {
            if (err) {
                console.log('Error: ', err)
                return res.status(301).json({'msg': err});
              } else {
              return res.status(200).json(result);
            }
        });

    }catch(err){
      console.log('Error -->', err)
      return res.status(501).json({'error': err.message});
    }
  }