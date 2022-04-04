import mongoose from "mongoose";
import config from "./config";


mongoose.set('useCreateIndex', true);
mongoose.connect(config.db.url,
    {useNewUrlParser:true, 
     useUnifiedTopology:true,
     useFindAndModify:false,
     useCreateIndex:true
    }
    ).then(db => console.log('DB successfull connectd.! '))
    .catch(error => console.log('DB error connection.. ' , error));