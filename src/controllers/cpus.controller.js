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

export const getCpus = async (req, res) => {
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



export const deleteCpuById = async (req,res) => {
  const deletedCpu = await Cpus.findByIdAndDelete(req.params.countryId,
    req.params.stateId,req.params.cityId,req.params.cpuId);
  res.status(204).json(deletedCpu)
}

