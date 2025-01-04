import { Schema, model } from "mongoose";

const coresEvents_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    data : [{}]
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('coreEvents', coresEvents_Schema);


