import housing_unit  from "../models/housing_unit";
import { Types } from "mongoose";


export const createHousing_unit = async (req,res) => {
  const {name,sim,location,avatar, division,
    enable,contact_email,contact_name, contact_phone} = await req.body;

  const detail = {};

   const newHousing_unit = new housing_unit({name, sim, location, avatar, detail, division,
    enable, contact_name, contact_email, contact_phone});

  try{
    const housing_unitSaved = await newHousing_unit.save();
    res.status(200).json(housing_unitSaved);
  }catch(e){
    console.log({'Error saving Housing_unit' : e});
    res.status(500).json({'error saving Housing_unit': e});
  }

}

export const getHousing_unit = async (req, res) => {
    housing_unit.find({}, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err});
        } else {
          res.status(200).json(results);
        }
      }); 

}


export const getOnlyHousing_unit = async (req, res) => {

  housing_unit.find({},{_id:1,name:1}, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({message: err});
      } else {
        res.status(200).json(results);
      }
    }); 

}

export const deleteHousing_unitById = async (req,res) => {
  const deletedHousingUnit = await housing_unit.findByIdAndDelete(req.params.housing_unitId);
  res.status(204).json(deletedHousingUnit)
}

