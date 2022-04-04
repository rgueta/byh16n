import Division from "../models/divisions";
import { Types } from "mongoose";

export const createDivision = async (req, res) => {
    const {Name,City,Location,Pc,Country} = req.body;
    const newDivision = Division({Name,City,Location,Pc,Country});
    const divisionSaved = await newDivision.save();

    res.status(201).json(divisionSaved);
}

export const getDivisions = async (req,res) => {
    await Division.find((err, result) => {
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
    await Division.find({},{_id:1,Name:1},(err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({message : err });
        }else{
            console.log(result);
            res.status(200).json(result);
        }
    });
}