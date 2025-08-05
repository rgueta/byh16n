import { Schema, model } from "mongoose";

const countriesSchema = new Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model("Countries", countriesSchema);
