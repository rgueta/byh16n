import { Schema, model } from "mongoose";

const cpusSchema = new Schema({
    id: {type:Number},
    name : {type : String, required: true},
    shortName : {type : String, required: true},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    division: {type: Number},
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('Cpus', cpusSchema);


