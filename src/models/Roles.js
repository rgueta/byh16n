import {Schema, model} from 'mongoose';

const roleSchema = new Schema({
    name : {type : String, required: true},
    showName : {type : String},
    level : {type : Number, required: true},

},
{
    versionKey:false
});

export default model('Roles', roleSchema);