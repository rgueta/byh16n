import { model, Schema } from "mongoose";

const pwdRSTSchema = new Schema({
    email : { type : String, required : true},
    confirmed : { type : Boolean, required : true, default : false},
    reseted : { type : Boolean, required : true, default : false},
},
{
    timestamps:true,
    versionKey:false
});

export default model('pwdRST', pwdRSTSchema);