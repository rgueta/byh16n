import configApp from "../models/configApp";
import  { Types } from "mongoose";


export const getConfig = async (req, res) => {

  try{

    await configApp.find({},async (err, results) => {
      if (err) {
        console.log(err);
        res.status(400).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

 }catch(e){
    console.log(e);
    res.status(500).json({message: e.message});
 }
  
}
