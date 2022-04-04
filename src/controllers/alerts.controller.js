import Alerts  from "../models/alerts";
import { Types } from "mongoose";
// import socket from "../components/Socket";
// import socket from 'socket.io';

export const getAlerts = async (req, res) => {

    // Alerts.find({}, (err, results) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).json({message: err});
    //     } else {
    //       res.status(200).json(results);
    //     }
    //   }); 

    const alerts = await Alerts.find();
    res.json(alerts)

}


export const createAlert = async (req, res) => {
    console.log(req.body.message);
    // socket.emit('alert',' - emmited')
    // const { privada,item,message} = req.body;

    // const newAlert = new Alerts({privada,item,message});
    // const AlertSaved = await newAlert.save();
    
   
    // // console.log(req.body);
    // res.status(201).json(AlertSaved);
    res.status(201).json({'message' : req.body.message});

}