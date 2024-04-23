import Users from '../models/Users';
import pwdRST from "../models/pwdRST";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';

import { Tools } from "../middleware/index";

let hash_pwdRST = '';
let pwdRST_id = '';

const transporter = nodemailer.createTransport({
    host: process.env.smtp_server,
        port: 587,
        secure:false,
        requireTLS:true,
        auth: {
          user: process.env.sourceEmailAddress,
          pass : process.env.smtp_pwd
        }
});


// #region html layout ---------------------------------------
let html_call = '';

// #endregion html layout ---------------------------------------

export const pwdRSTReq = async (req,res) => {
    const { model, platform, operatingSystem, osVersion, manufacturer,
        isVirtual, webViewVersion, uuid } = await req.body;

    const device = { model, platform, operatingSystem, osVersion, manufacturer,
        isVirtual, webViewVersion, uuid};

    try{

        let foundUser = await Users.find({email : req.params.email});
        if(!foundUser.length) return res.status(500).json({'message': 'User not found'});

        // #region save on DB   ------------------------------

        // Verify if password reset for this email exists
        const foundPwdRST = await pwdRST.find({email : req.body.email, reseted:false});

        if(foundPwdRST.length > 0){
            return res.status(503).json({'status' : 503,
                'msg' : 'Ya existe peticion para este correo'});
        }

        const newPwdRST = new pwdRST({email:req.params.email,confirmed:false,
            reseted:false, device});

        newPwdRST.save(async (err, pwdRST_saved) => {
            if(err) return res.status(501).json({'msg': 'Error can not saved pwdRST'});
            pwdRST_id = await pwdRST_saved._id;

            createHTML();

            const mailOption = await {
                from : 'byh16@gmail.com',
                to : req.params.email,
                subject : 'Pssword reset',
                html : html_call
            }

            await transporter.sendMail(mailOption, (err, info) =>{
                if(err){
                    res.status(501).json({'msg': err})
                }else{
                    res.status(201).json({'email sent': info.response})
                }
            });

        });

        // #endregion  -----------------------------------------

        return res.status('201').json({'message': 'pwdRST email sent'})

    }catch(e){
        return res.status(501).json({'msg' : e.message})
    }
    
}

export const pwdRSTConfirm = async (req, res) => {
    try{
        const foundpwdRST  = await pwdRST.find({_id : req.params.id});
        if(!foundpwdRST.length) return res.status(300).json({'status':300,
        'error' : 'No hay solicitud para este usuario'});

        const foundUser = await Users.findOne({email : foundpwdRST[0].email});
        if(!foundUser) return res.status(300).json({'status':300,'error' : 'User not found'});

        pwdRST.findByIdAndUpdate(req.params.id,{$set : {confirmed : true}},{new:false},
             (err, resultConfirmed) => {
            if(err){
                return res.status(502).json({'msg' : 'Could not update reseted'});
            }
        });

        res.status(201).json({'msg':'Password reset confirmation for [ ' + foundUser.email + ' ]' });
    }catch(err){
        res.status(501).json({'msg':'Error: ' + err.message});
    }
}


export const pwdRSTVerify = async (req, res) => {
    console.log('Password RST verification ..! ', req.params);

   const foundpwdRST  = await pwdRST.find({_id : req.params.id,reseted:false});
   try{
        if(!foundpwdRST.length) 
            return res.status(300).json({'status':300,
                'error' : 'No hay solicitud para este usuario'});

            return res.status(200).json({'status':200,
                'msg' : 'Si hay solicitud activa'});
       
   }catch(e){
    res.status(501).json({'status':501,'error': e});
    }
}


export const pwdRSTApply = async (req, res) => {
    console.log('Password RST confirmed..! ', req.params);

   const foundpwdRST  = await pwdRST.find({_id : req.params.id,reseted:false});
   if(!foundpwdRST.length) return res.status(300).json({'status':300,'error' : 'No hay solicitud para este usuario'});

   try{
        const foundUser = await Users.findOne({email : foundpwdRST[0].email});
        if(!foundUser) return res.status(301).json({'status':301,'error' : 'User not found'});

        const Encryptedpwd = await encryptPassword(req.params.pwd);
        if(!Encryptedpwd) return res.status(302).json({'status':302,'error' : 'No password encrypted.'});

        Users.findOneAndUpdate({email:foundpwdRST[0].email}, {$set : {pwd:Encryptedpwd}},{new:false},(err, result) =>{
            if(err){
                return res.status(500).json({'status':500,'error' : 'Could not update password.'});
            }
            
            console.log('userPwdChanged -- > ',result);

            pwdRST.findByIdAndUpdate(req.params.id,{$set : {reseted : true}},{new:false}, (err, resultReseted) => {
                if(err){
                    return res.status(501).json({'status':501,'error' : 'Could not update reseted.'});
                }
            });
    
            res.status(201).json({'status':201,'msg':'Password changed for [' + foundUser.email + '], encrypted pwd --> ' + Encryptedpwd });
        })
   }catch(e){
    res.status(501).json({'status':501,'Error': e});
    }
}

// #region create HTML layout   -------------------------------------------------------

async function encryptPassword(pwd){
    const salt = await bcrypt.genSalt();
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
                .logo img {height: 90px; width: 100px; border-radius: 50%; margin-left: 20px;}
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
                <input type="button" value="RECUPERAR CLAVE">
            </a>
            <p>
                Si no quieres reiniciar tu contraseña, tan solo ignora este correo y accesa a nuestros servicios 
                como usualmente lo haces.
            </p>
        </body>
       
    </html>
    `
}

// #endregion create HTML layout   -------------------------------------------------------
