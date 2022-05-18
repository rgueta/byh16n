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
    Cores.find({},{_id:1,name:1,Houses:1,Address:1,coord:1,
      Sim:1,detail:1,
      location:{$concat : ['$country', '.', '$state', '.', '$city',
      '.', {$toString : '$division'}, '.', '$cpu', '.', '$shortName']}
      }, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

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

export const deleteCoreById = async (req,res) => {
  const deletedCore = await Cores.findByIdAndDelete(req.params.coreId);
  res.status(204).json(deletedCore)
}

