import configApp from "../models/configApp";
import  { Types } from "mongoose";

export const getConfig = async (req, res) => {

  try{

    configApp.find({})
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.error('Config call error...: ', err)
      res.status(501).json({message: err});
    });

 }catch(e){
    console.error('Config call error...: ', e.message)
    res.status(501).json({message: e.message});
 }
  
}
