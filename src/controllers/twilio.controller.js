import { Twilio } from "twilio";
import { NumberInstance } from "twilio/lib/rest/pricing/v2/number";
import Users from "../models/Users";

const client = new Twilio(process.env.SID, process.env.AUTH_TOKEN);

export const sendMsgOpen = async(req, res) => {
    
    try{
        client.messages 
      .create({ 
         body: req.params.msg,  
         messagingServiceSid: process.env.MSG_SID,      
         to: req.params.phone 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
    }catch(err){
        res.status(404).json({'msg':'twilio send error' + JSON.stringify(err)})
    }
    res.status(201).json({'msg':'twilio send ok'})
}

export const sendMsgAccess = async(req, res) => {
  return
  const msg = req.params.msg.split(',');
  const foundUSer = Users.findOne({_id: msg[1]})
  if(foundUSer){
    if(msg[0].toLowerCase() == 'blocked'){
      await Users.findByIdAndUpdate(msg[1], {$set : { status : 4 }},{new : false}, (err , result) => {
        if(err){
          return res.status(200).json({'msg': 'error', 'status' : 'Could not updated status blocked'})
        }
      });
    }else if(msg[0].toLowerCase() == 'unblocked'){
      Users.findByIdAndUpdate(msg[1], {$set : { status : 1 }},{new : false}, (err , result) => {
        if(err){
          return res.status(200).json({'msg': 'error', 'status' : 'Could not updated status blocked'})
        }
      });
    }    
  }
  
  try{
      client.messages 
    .create({ 
       body: req.params.msg,  
       messagingServiceSid: process.env.MSG_SID,      
       to: req.params.phone 
     }) 
    .then(message => console.log(message.sid)) 
    .done();
  }catch(err){
      res.status(404).json({'msg':'twilio send error' + JSON.stringify(err)})
  }
  res.status(201).json({'msg':'twilio send ok'})
}