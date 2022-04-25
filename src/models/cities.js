import { Schema, model } from "mongoose";

const citiesSchema = new Schema({
    name : {type : String, required: true},
    shortName : {type : String, required: true},
    country: {type: String, require:true},
    state: {type: String, require:true},
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('Cities', citiesSchema);


