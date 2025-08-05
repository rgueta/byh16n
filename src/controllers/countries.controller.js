import Countries from "../models/countries";
import { Types } from "mongoose";

export const createCountry = async (req, res) => {
  const { Name, shortName } = await req.body;

  const newCountry = new Countries({ Name, shortName });

  try {
    const countrySaved = await newCountry.save();
    res.status(200).json(countrySaved);
  } catch (e) {
    console.log({ "Error saving country": e });
    res.status(500).json({ "error saving Country": e });
  }
};

export const getCountries = async (req, res) => {
  Countries.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log("Error --> ", err);
      res.status(500).json({ message: err });
    });
};

export const getOnlyCountries = async (req, res) => {
  Countries.find({}, { _id: 1, name: 1 })
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

export const deleteCountryById = async (req, res) => {
  const deletedCountry = await Countries.findByIdAndDelete(
    req.params.countryId,
  );
  res.status(204).json(deletedCountry);
};
