import { Schema, model } from "mongoose";

const currentStatus_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    name:{type: String, required:true},
    data : [{}]
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('currentStatus', currentStatus_Schema);