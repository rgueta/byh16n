import config from "../models/config";
import  { Types } from "mongoose";


export const getConfig = async (req, res) => {
    const NumDivision = parseInt(req.params.division)
      config.find({}, (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).json({message: err});
          } else {
            res.status(200).json(results);
          }
        }); 
  
  }
  