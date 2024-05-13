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
      return res.status(501).json({'msg': 'Can not update cpu'})    
  }catch(e){
    return res.status(501).json({'error saving Cpu ': e});
  }

}

export const getCpu = async (req, res) => {
  try{
    await Cpus.aggregate([
      { $sort: {name:1}},
      {
          $project: {
              name : 1,
              location: { 
                $concat : ["$country", "." , "$state",
                    "." ,"$city", ".", {$toString : "$division" }, 
                    "." , "$shortName"]
              }
              
          }
      }
    ], async (err, result) => {
        if (err) {
            console.log('Error: ', err)
            return res.status(301).json({'msg': err});
          } else {
          return res.status(200).json(result);
        }
    });

  }catch(err){
    console.log('Error -->', err)
    return res.status(501).json({'error': err.message});
  }
}

export const getCpu_ = async (req, res) => {
  try{

    await Cpus.find({},{name:1},{"sort": {name:1}}, async (err, results) => {
      if (err) {
        res.status(501).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

 }catch(e){
    res.status(501).json({message: e.message});
 }
  
}

export const getCpusFull = async (req, res) => {
    const NumDivision = parseInt(req.params.division)
   await Cpus.find({country:req.params.country,
                state:req.params.state, 
                city:req.params.city,
                division:NumDivision}, (err, results) => {
        if (err) {
          res.status(501).json({'msg': err});
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
              division:NumDivision},{name:1, shortName:1}, (err, results) => {
      if (err) {
        res.status(501).json({'msg': err});
      } else {
        res.status(200).json(results);
      }
    }); 

}


export const deleteCpuById = async (req,res) => {
  try{
    const deletedCpu = await Cpus.findByIdAndDelete(req.params.countryId,
    req.params.stateId,req.params.cityId,req.params.cpuId);
    res.status(204).json(deletedCpu);
  }catch(err){
    res.status(504).json({'Error': err.message});
  }
  
}

