import Divisions from "../models/divisions";
import { Types } from "mongoose";

export const createDivision = async (req, res) => {
    const {Name,City,cityShortName,Location,Pc,Country,Description} = req.body;
    const newDivision = Divisions({Name,City,cityShortName,
        Location,Pc,Country,id,Description});
    const divisionSaved = await newDivision.save();

    res.status(201).json(divisionSaved);
}

export const getDivisions = async (req,res) => {
    await Divisions.find({country:req.params.country,
        state:req.params.state, 
        cityShortName:req.params.city},(err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({message : err });
        }else{
            console.log(result);
            res.status(200).json(result);
        }
    });
}

export const getDivisionsLite = async (req,res) => {
    await Divisions.find({country:req.params.country,
        state:req.params.state, 
        cityShortName:req.params.city},{_id:1,Name:1},(err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({message : err });
        }else{
            console.log(result);
            res.status(200).json(result);
        }
    });
}