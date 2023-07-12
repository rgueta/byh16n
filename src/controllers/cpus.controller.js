import Cpus  from "../models/cpus";
import { Types } from "mongoose";


export const createCpu = async (req,res) => {
  const {name, shortName, country, state, city} = await req.body;

   const newCpu = new Cpus({name, shortName, country, state, city});

  try{
    const cpuSaved = await newCpu.save();
    res.status(200).json(cpuSaved);
  }catch(e){
    console.log({'Error saving Cpu ' : e});
    res.status(500).json({'error saving Cpu ': e});
  }
}

export const updateCpu = async (req,res) => {
  const {_id, cores, entry, coord, houses, sim, school } = await req.body;

  try{
    const updCpu = await Cpus.updateOne({_id : _id},{$set:{cores:cores, entry:entry, coord:coord, houses:houses, sim:sim, school:school}});

    if(updCpu)
      res.status(200).json({'msg': updCpu})
    else
      return res.status(400).json({'msg': 'Can not update cpu'})    
  }catch(e){
    return res.status(500).json({'error saving Cpu ': e});
  }

}

export const getCpusFull = async (req, res) => {
    const NumDivision = parseInt(req.params.division)
   await Cpus.find({country:req.params.country,
                state:req.params.state, 
                city:req.params.city,
                division:NumDivision}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}

export const getCpusBasic = async (req, res) => {
  const NumDivision = parseInt(req.params.division)
 await Cpus.find({country:req.params.country,
              state:req.params.state, 
              city:req.params.city,
              division:NumDivision},{name:1}, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

}


export const deleteCpuById = async (req,res) => {
  const deletedCpu = await Cpus.findByIdAndDelete(req.params.countryId,
    req.params.stateId,req.params.cityId,req.params.cpuId);
  res.status(204).json(deletedCpu)
}

