import { Schema, model } from "mongoose";

const alertsSchema = new Schema({
    core : { type : Schema.Types.ObjectId, required : true},
    item : { type : String, required : true},
    message : { type : String, required : true}
    },
    {
        timestamps:true,
        versionKey:false
    
});

export default model('Alerts', alertsSchema);