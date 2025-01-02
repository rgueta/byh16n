import { Schema, model } from "mongoose";

const coresEvents_Schema = new Schema({
    coreId : {type : Schema.Types.ObjectId, required: true},
    data : {type: Schema.Types.Array}
    },
    {
        timestamps:true,
        versionKey:false
    });

export default model('coreEvents', coresEvents_Schema);


