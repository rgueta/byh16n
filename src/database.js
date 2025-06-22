import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// mongoose.set('useCreateIndex', true);
// mongoose.connect(`${process.env.DB_HEAD_URL}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,

mongoose.connect(`${process.env.DB_HEAD_URL}://${process.env.DB_URI}`,
    ).then(db => console.log('DB successfull connectd.! to ', process.env.DB_URI))
    .catch(error => console.log('DB error connection.. ' , error));
