import {Schema, model} from 'mongoose';

const housing_unitSchema = new Schema({
        name : {type : String, required: true},
        sim : {type : String, required: true},
        location : {type : [String], required: true},
        avatar : {type : String},
        detail : {type : {String}},
        division :{type : Schema.Types.ObjectId, required :true},
        enable : {type : Boolean},
        contact_email : {type : String},
        contact_name : {type : String},
        contact_phone :  {type : String}
    },
    {
        timestamps:true,
        versionKey:false
});

export default model('housing_unit', housing_unitSchema);
