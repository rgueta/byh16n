import {Schema, model} from 'mongoose';
const divisionsSchema = new Schema({
        Name : {type : String, required: true},
        City : {type : String, required: true},
        coord : {type : [String], required: true},
        Pc : Number,
        Country : {type : String, required: true},
        Description : {type : String},
        id: {type: Number},
        cityShortName : {type : String}
    },
    {
        timestamps:true,
        versionKey:false
});

export default model('divisions', divisionsSchema);

