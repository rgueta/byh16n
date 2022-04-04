import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';


const visitorSchema = new Schema({
    userId: {type: Schema.Types.ObjectId},
    name : {type : String, required: true},
    email : {type : String, unique : true,required: true, lowercase:true, trim:true},
    username : {type : String},
    pwd : {type : String, trim: true},
    address : {type : String},
    sim : {type : String, required: true},
    gender : {type : String},
    avatar : {type : String},
},
{
    timestamps:true,
    versionKey:false
});

visitorSchema.statics.encryptPassword = async (pwd) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pwd,salt);
}

    visitorSchema.statics.comparePassword = async(password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

export default model('Visitors', visitorSchema);