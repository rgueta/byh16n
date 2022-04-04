import {Schema, model} from 'mongoose';

// const code_eventsSchema = new Schema({
//     codeId : {type : Schema.Types.ObjectId, required : true},
//     picId : {type : String, required : true},
//     CoreSim : {type : String, required : true}
//     },
//     {
//         timestamps:true,
//         versionKey:false
// });

const divisionsSchema = new Schema({
        Name : {type : String, required: true},
        City : {type : String, required: true},
        Location : {type : [String], required: true},
        Pc : Number,
        Country : {type : String, required: true},
        Description : {type : String}
    },
    {
        timestamps:true,
        versionKey:false
});

export default model('divisions', divisionsSchema);

// export default model('code_events', divisionSchema);

