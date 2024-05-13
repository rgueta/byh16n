import configApp from "../models/configApp";
import  { Types } from "mongoose";


export const getConfig = async (req, res) => {

  try{

    await configApp.find({},async (err, results) => {
      if (err) {
        res.status(501).json({message: err});
      } else {
        res.status(200).send(results);
      }
    }); 

 }catch(e){
    res.status(501).json({message: e.message});
 }
  
}
