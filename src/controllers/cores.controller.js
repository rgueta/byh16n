import Cores  from "../models/cores";
import { Types } from "mongoose";


export const createCore = async (req,res) => {
  const {Name, Address, webService, Sim, coord, qty, Motor, Gate_type, Gate_long, 
       Gate_heigh, Pedestrian_type, Pedestrian_long, Pedestrian_heigh , housing_unit,
  enable, contact_name, contact_email, contact_phone} = await req.body;

  const Houses = {qty,detail:[]};
  const detail = {Motor, Gate_type, Gate_long, 
    Gate_heigh, Pedestrian_type, Pedestrian_long, Pedestrian_heigh};

   const newCore = new Cores({Name, Address, webService, Sim, coord ,Houses, detail, housing_unit,
    enable, contact_name, contact_email, contact_phone});

  try{
    const coreSaved = await newCore.save();
    res.status(200).json(coreSaved);
  }catch(e){
    console.log({'Error saving core' : e});
    res.status(500).json({'error saving Core': e});
  }

}

export const getCoresAdmin = async (req, res) => {
  try{
    Cores.find({},{_id:1,name:1,Houses:1,Address:1,coord:1,
      Sim:1,detail:1,enable:1,
      location:{$concat : ['$country', '.', '$state', '.', '$city',
      '.', {$toString : '$division'}, '.', '$cpu', '.', '$shortName']}
      },async (err, results) => {
        if (err) {
          return res.status(301).json({'msg': err});
        } else {

         return res.status(200).json(results);
          // return next();// Fail both sides conbined two lines

          // await res.setHeader('Content-Type', 'application/json');
          // await res.send(results);
          // next(); Fail both sides conbined three lines
          

          // next();// Fail both sides conbined two lines
          // return await res.status(200).json(results);

          // await res.status(200).json(results);
          // return;// Fail both sides conbined two lines

          // await res.status(200).json(results);
          // await next(); // Fail both sides conbined three lines
          // return;

          // await res.status(200).json(results);
          // await next(); // Fail both sides conbined two lines

          // await res.status(200).json(results);
          // return await next(); // Fail both sides conbined two lines

          // await res.status(200).json(results);
          // return next(); // Fail both sides conbined two lines

          // await res.status(200).json(results);
          // return; // Fail both sides conbined two lines

          // await res.status(200).json(results);
          // next();// Fail both sides conbined two lines

          // next();// Fail both sides conbined two lines
          // await res.status(200).json(results);

          // next();
          // return res.status(200).json(results); // Fail both sides conbined two lines

          // next();
          // res.status(200).json(results); // Fail both sides conbined two lines

          // res.send(results) // Fail both sides conbined two lines
          // next()

        // res.status(200).json(results); //Fail both sides
        // await res.status(200).json(results); //Fail both sides
        // return await res.status(200).json(results); //Fail both sides
        // return next(results); //Ok server side, no data response
        // return next();//OK server side, no data response
        }
      }); 
  }catch(err){
    console.log('Error correcto -->', err)
    return res.status(301).json({'error': err});
  }
}

export const getCores = async (req, res) => {
  const NumDivision = parseInt(req.params.division)
    Cores.find({country:req.params.country,
      state:req.params.state, 
      city:req.params.city,
      division:NumDivision,
      cpu:req.params.cpu}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}


export const getCoresLight = async (req, res) => {
  const NumDivision = parseInt(req.params.division)
  Cores.find({country:req.params.country,
    state:req.params.state, 
    city:req.params.city,
    division:NumDivision,
    cpu:req.params.cpu},{_id:1,name:1,shortName:1}, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

}


export const enableCore = async (req,res) => {
  const updatedCore = await Cores.updateOne({_id:Types.ObjectId(req.body.coreId)},{$set: {enable:true}})
  if(updatedCore){
    console.log('Core enabled OK')
    res.status(204).json({'Msg':'Core enabled Ok'})
    // res.status(204).json(updatedCore)
  }else{
    res.status(404).json({'Msg' : 'Error enable core: '})
  }
  
}

export const disableCore = async (req,res) => {
  console.log('coreId --> ',req.body.coreId)
  const updatedCore = await Cores.updateOne({_id:Types.ObjectId(req.body.coreId)},{$set:{enable:false}})
  if(updatedCore){
    console.log('Core disable OK')
    res.status(204).json({'Msg':'Core disabled Ok '})
    // res.status(204).json(updatedCore)
  }else{
    res.status(404).json({'Msg' : 'Error core not disabled'})
  }
}


export const deleteCoreById = async (req,res) => {
  const deletedCore = await Cores.findByIdAndDelete(req.params.coreId);
  res.status(204).json(deletedCore)
}

