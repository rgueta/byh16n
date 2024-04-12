import { Collection, Schema, model } from "mongoose";

const backSchema = new Schema({
    cpu : {type: Schema.Types.ObjectId, required : true},
    core : {type : Schema.Types.ObjectId, required : true},
    name : {type : String, required : true},
    username : {type : String, required : true},
    email : {type : String, required : true},
    sim : {type : String, required : true},
    house: {type : String, required : true},
    uuid : {type: String, required: true},
    gender : {type: String, required: true},
    note: {type: String}
},
{
    timestamps:true,
    versionKey:false
});

export default model('backstage', backSchema, 'backstage');