import { Schema, model } from "mongoose";

const statesSchema = new Schema({
    Name : {type : String, required: true},
    shortName : {type : String, required: true},
    country: {type: String, required: true},
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('States', statesSchema);


