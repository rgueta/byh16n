import States  from "../models/states";
import { Types } from "mongoose";


export const createState = async (req,res) => {
  const {name, shortName, country} = await req.body;

   const newState = new States({name, shortName, country});

  try{
    const stateSaved = await newState.save();
    res.status(200).json(stateSaved);
  }catch(e){
    console.log({'Error saving State' : e});
    res.status(500).json({'error saving State': e});
  }

}

export const getStates = async (req, res) => {
    States.find({country:req.params.country}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}


export const getState = async (req, res) => {
    States.find({country:req.params.countryId,state:req.params.stateId}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}



export const deleteStateById = async (req,res) => {
  const deletedState = await Countries.findByIdAndDelete(req.params.countryId,req.params.stateId);
  res.status(204).json(deletedState)
}

