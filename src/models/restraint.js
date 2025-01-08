import { Schema, model } from "mongoose";

const restraint_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    data : [{}]
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('restraint', restraint_Schema);