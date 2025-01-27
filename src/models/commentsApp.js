import { Schema, model } from "mongoose";

const commentApp_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    userId : {type : Schema.Types.ObjectId, required: true},
    name:{type: String, required:true},
    comment : [{}]
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('commentApp', commentApp_Schema);