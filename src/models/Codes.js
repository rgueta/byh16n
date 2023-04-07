 import { Schema, model } from "mongoose";

const codeSchema = new Schema({
    code : { type : String},
    initial : { type : String, required : true},
    expiry : { type : String, required : true},
    source : {
        user: { type : Schema.Types.ObjectId, required : true},
        platform : { type : String, required : true},
        id : { type : String, required : true}
    },
    comment : {type : String},
    visitorSim : {type : String, required :true},
    visitorName : {type : String, required :true},
    enable : {type : Number, default:true}
    },
    {
        timestamps:true,
        versionKey:false
    }
);

export default model('Codes', codeSchema);