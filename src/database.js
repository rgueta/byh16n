import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./config";
dotenv.config()

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser:true, 
     useUnifiedTopology:true,
     useFindAndModify:false,
     useCreateIndex:true
    }
    ).then(db => console.log('DB successfull connectd.! '))
    .catch(error => console.log('DB error connection.. ' , error));