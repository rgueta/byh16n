import { Schema, model } from "mongoose";

const alertsSchema = new Schema({
    privada : { type : Schema.Types.ObjectId, required : true},
    item : { type : String, required : true},
    message : { type : String, required : true}
    },
    {
        timestamps:true,
        versionKey:false
    
});

export default model('Alerts', alertsSchema);