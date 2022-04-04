import { Schema, model } from "mongoose";

const infoSchema = new Schema({
    title : {type: String, required : true},
    url : {type : String, required : true},
    description : {type : String, required : true},
    image : {type : String, required : true},
    path : {type : String, required : true},
    size : {type : Number, required : true},
    like : {type: Number, default: 0},
    disable : {type: Boolean, default : false}
},
{
    timestamps:true,
    versionKey:false
});

export default model('information', infoSchema);