import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

mongoose.set('useCreateIndex', true);
mongoose.connect(`${process.env.DB_HEAD_URL}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    {useNewUrlParser:true, 
     useUnifiedTopology:true,
     useFindAndModify:false,
     useCreateIndex:true
    }
    ).then(db => console.log('DB successfull connectd.! '))
    .catch(error => console.log('DB error connection.. ' , error));