import Cores  from "../models/cores";
import { Types } from "mongoose";


export const createCore = async (req,res) => {
  const {Name, Address, webService, Sim, Location,qty, Motor, Gate_type, Gate_long, 
       Gate_heigh, Pedestrian_type, Pedestrian_long, Pedestrian_heigh , housing_unit,
  enable, contact_name, contact_email, contact_phone} = await req.body;

  const Houses = {qty,detail:[]};
  const detail = {Motor, Gate_type, Gate_long, 
    Gate_heigh, Pedestrian_type, Pedestrian_long, Pedestrian_heigh};

   const newCore = new Cores({Name, Address, webService, Sim, Location,Houses, detail, housing_unit,
    enable, contact_name, contact_email, contact_phone});

  try{
    const coreSaved = await newCore.save();
    res.status(200).json(coreSaved);
  }catch(e){
    console.log({'Error saving core' : e});
    res.status(500).json({'error saving Core': e});
  }

}

export const getCores = async (req, res) => {
    Cores.find({}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}


export const getOnlyCores = async (req, res) => {

  Cores.find({},{_id:1,Name:1}, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

}

export const deleteCoreById = async (req,res) => {
  const deletedCore = await Cores.findByIdAndDelete(req.params.coreId);
  res.status(204).json(deletedCore)
}

