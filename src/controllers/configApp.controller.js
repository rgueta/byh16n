import configApp from "../models/configApp";
import  { Types } from "mongoose";


export const getConfig = async (req, res) => {
  const codeId = Types.ObjectId('65a5a64eb40dc3f28b7b9603');
  try{
    
    const result = await configApp.find().lean().exec(); 
    if(result != null){
      console.log('result -> ',result);
      res.status(200).json(result);
    }else{
      res.status(400).json({message: 'No result'});
    }

  //  configApp.find({_id: codeId},async (err, results) => {
    // await configApp.find({},async (err, results) => {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).json({message: err});
    //   } else {
    //     await console.log('result --> ',results)
    //     res.status(200).json(results);
    //   }
    // }); 


 }catch(e){
    console.log(e);
    res.status(500).json({message: e.message});
 }

  // ConfigApp.find({},async (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).json({message: err});
  //     } else {
  //       console.log(JSON.stringify(results))
  //       res.status(200).json(results);
  //     }
  //   }); 
  
  }


  export const getConfigAll = async (req, res) => {
    const codeId = Types.ObjectId('65a5a64eb40dc3f28b7b9603');
    try{
      
      // const result = await configApp.find().lean().exec(); 
      // if(result != null){
      //   console.log('result -> ',result);
      //   res.status(200).json(result);
      // }else{
      //   res.status(400).json({message: 'No result'});
      // }
  
    //  configApp.find({_id: codeId},async (err, results) => {
      configApp.find({},async (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          console.log('result all --> ',results)
          res.status(200).json(results);
        }
      }); 
  
  
   }catch(e){
      console.log(e);
      res.status(500).json({message: e.message});
   }
  
    // ConfigApp.find({},async (err, results) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).json({message: err});
    //     } else {
    //       console.log(JSON.stringify(results))
    //       res.status(200).json(results);
    //     }
    //   }); 
    
    }
  