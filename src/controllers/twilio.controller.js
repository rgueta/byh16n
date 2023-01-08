import { Twilio } from "twilio";
import { NumberInstance } from "twilio/lib/rest/pricing/v2/number";
import Users from "../models/Users";

const client = new Twilio(process.env.SID, process.env.AUTH_TOKEN);

export const sendMsgOpen = async(req, res) => {
    
    try{
        client.messages 
      .create({ 
         body: req.params.msg,  
         messagingServiceSid: 'MGe8f3e7143c2962fbeac086f010615494',      
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
  // console.log('twilio access params --> ', req.params);
  const msg = req.params.msg.split(',');
  // console.log('MEssage --> ', msg);
  const foundUSer = Users.findOne({_id: msg[1]})
  if(foundUSer){
    console.log('Si se encontro usuario')
    if(msg[0].toLowerCase() == 'blocked'){
      console.log('Set Blocked status to ID -->', req.params.userId )
      await Users.findByIdAndUpdate(msg[1], {$set : { status : 4 }},{new : false}, (err , result) => {
        if(err){
          return res.status(200).json({'msg': 'error', 'status' : 'Could not updated status blocked'})
        }
        console.log('return value after updated blocked --> ', result);
      });
    }else if(msg[0].toLowerCase() == 'unblocked'){
      console.log('Si es Unblocked command')
      Users.findByIdAndUpdate(msg[1], {$set : { status : 1 }},{new : false}, (err , result) => {
        if(err){
          return res.status(200).json({'msg': 'error', 'status' : 'Could not updated status blocked'})
        }
        console.log('return value after updated  unblocked --> ', result);
      });
    }
    
  }else{
    
    console.log('No se encontro usuario')
  }
  
  try{
      client.messages 
    .create({ 
       body: req.params.msg,  
       messagingServiceSid: 'MGe8f3e7143c2962fbeac086f010615494',      
       to: req.params.phone 
     }) 
    .then(message => console.log(message.sid)) 
    .done();
  }catch(err){
      res.status(404).json({'msg':'twilio send error' + JSON.stringify(err)})
  }
  res.status(201).json({'msg':'twilio send ok'})
}