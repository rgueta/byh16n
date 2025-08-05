import Cities from "../models/cities";
import { Types } from "mongoose";

export const createCity = async (req, res) => {
  const { name, shortName, country, state } = await req.body;

  const newCity = new Cities({ name, shortName, country, state });

  try {
    const citySaved = await newCity.save();
    res.status(200).json(citySaved);
  } catch (e) {
    console.log({ "Error saving City ": e });
    res.status(500).json({ "error saving City ": e });
  }
};

export const getCities = async (req, res) => {
  await Cities.find({ country: req.params.country, state: req.params.state })
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

export const deleteCityById = async (req, res) => {
  const deletedCity = await Cities.findByIdAndDelete(
    req.params.countryId,
    req.params.stateId,
    req.params.cityId,
  );
  res.status(204).json(deletedCity);
};
