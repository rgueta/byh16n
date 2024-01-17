import { Schema, model } from "mongoose";

const configAppSchema = new Schema({
    backendUrl : { type : String, required : true },
    debugging : { type : Boolean, default : false },
    debugging_send_sms : { type : Boolean, default : false },
    admin_device_uuid : { type : [ String ] }
},
{
    timestamps:true,
    versionKey:false
});

export default model('configApp', configAppSchema);
