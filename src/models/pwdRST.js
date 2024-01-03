import { model, Schema } from "mongoose";

const pwdRSTSchema = new Schema({
    email : { type : String, required : true},
    confirmed : { type : Boolean, required : true, default : false},
    reseted : { type : Boolean, required : true, default : false},
    device : {
        model: {type : String},
        platform: {type : String},
        operatingSystem: {type : String},
        osVersion: {type : String},
        manufacturer: {type : String},
        isVirtual: {type : Boolean},
        webViewVersion: {type : String},
        uuid: {type : String},
    },
},
{
    timestamps:true,
    versionKey:false
});

export default model('pwdRST', pwdRSTSchema);