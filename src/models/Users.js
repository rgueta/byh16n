import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new Schema({
    name : {type : String, required: true},
    email : {type : String, unique : true,required: true, lowercase:true, trim:true},
    username : {type : String, required: true},
    pwd : {type : String, required: true, trim: true},
    core : {type : Schema.Types.ObjectId, required: true},
    house : {type : Number, required: true},
    uuid : {type : String, required: true},
    sim : {type : String, required: true},
    gender : {type : String, required: true},
    avatar : {type : String},
    roles : [{
        ref: 'Roles',
        type: Schema.Types.ObjectId
    }],
    status : {type : Number}
},
{
    timestamps:true,
    versionKey:false
});

userSchema.statics.encryptPassword = async (pwd) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pwd,salt);
}


userSchema.statics.comparePassword = async(password, receivedPassword) => {
    console.log('receivedPassword --> ' + receivedPassword)
    return await bcrypt.compare(password, receivedPassword);
}

export default model('Users', userSchema);