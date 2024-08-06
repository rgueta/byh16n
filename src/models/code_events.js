import { Schema, model } from "mongoose";

const code_eventsSchema = new Schema({
    codeId : {type : Schema.Types.ObjectId, required : true},
    picId : {type : String, required : true},
    CoreSim : {type : String, required : true},
    doorName : {type : String}
    },
    {
        timestamps:true,
        versionKey:false
});

export default model('code_events', code_eventsSchema);