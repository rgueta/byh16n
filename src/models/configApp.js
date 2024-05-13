import { Schema, model } from "mongoose";

const appSchema = new Schema({
    serverUrl : { type : String, required : true },
    debug : { type : Boolean, default : false },
    send_sms : { type : Boolean, default : false },
    admin_device : { type : [ String ] },
    admin_email : [ {
        name: { type : String },
        email:{ type : String }
    } ]
},
{
    timestamps:true,
    versionKey:false
});

export default model('configApp', appSchema, 'configApp');
