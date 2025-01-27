import { Schema, model } from "mongoose";

const commentsApp_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    userId : {type : Schema.Types.ObjectId, required: true},
    comment : [{}]
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('commentsApp', commentsApp_Schema);