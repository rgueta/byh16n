import { Schema, model } from "mongoose";

const cpusSchema = new Schema({
    id: {type: Number},
    name : {type : String, required: true},
    shortName : {type : String, required: true},
    entry : {type: Number},
    sim  : {type: String},
    houses : {type: Number},
    cores : {type: Number},
    school : {type: Boolean},
    stores : {type: Array},
    country: {type: String},
    state : {type: String},
    city: {type: String},
    division: {type: Number},
    coord : {type : [String], required: true},
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('Cpus', cpusSchema);


