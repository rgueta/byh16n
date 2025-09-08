import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// mongoose.set('useCreateIndex', true);
// mongoose.connect(`${process.env.DB_HEAD_URL}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
console.log(
  "cnn --> " +
    `${process.env.DB_HEAD_URL}://${process.env.DB_URI}?replicaSet=rs0`,
);

mongoose
  .connect(`${process.env.DB_HEAD_URL}://${process.env.DB_URI}?replicaSet=rs0`)
  .then((db) =>
    console.log(
      "DB successfull connectd.! to ",
      process.env.DB_HEAD_URL + " replica set",
    ),
  )
  .catch((error) => console.log("DB error connection.. ", error));
