import { Schema, model } from "mongoose";

const coresSchema = new Schema({
    name : {type : String, required: true},
    Address : {type : String, required: true},
    Sim : {type : String, required: true, default:''},
    coord : {type : [String], required: true},
    Houses : {
        qty : {type : Number, required: true},
        detail : [
            {
                houseId : {type : String, required: true},
                userId : {type : Schema.Types.ObjectId, required :true},
                pic : {type : String},
                description : {type : String},
            }
        ]
    },
    detail : {
        Motor : {type : String, required: true},
        Gate_type :{type : String, required: true},
        Gate_long : {type : Number, required: true},
        Gate_height : {type : Number, required: true},
        Pedestrian_type : {type : String, required: true},
        Pedestrian_long : {type : Number, required: true},
        Pedestrian_height : {type : Number, required: true},
    },
    housing_unit : {type : Schema.Types.ObjectId, required :true},
    shortName : {type: String},
    divisionId : {type: Schema.Types.ObjectId},
    cpuId : {type: Schema.Types.ObjectId},
    country : {type: String},
    state : {type: String},
    city : {type: String},
    division : {type: Number},
    cpu : {type: String},
    enable : {type: Boolean},
    code_expiry : {type: Number},
    webService : {type: Boolean},
    remote:{type:Boolean}
    },
    
// });
    {
        timestamps:true,
        versionKey:false
    });

export default model('Cores', coresSchema);


