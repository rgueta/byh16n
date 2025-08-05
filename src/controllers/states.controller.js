import States from "../models/states";
import { Types } from "mongoose";

export const createState = async (req, res) => {
  const { name, shortName, country } = await req.body;

  const newState = new States({ name, shortName, country });

  try {
    const stateSaved = await newState.save();
    res.status(200).json(stateSaved);
  } catch (e) {
    console.log({ "Error saving State": e });
    res.status(500).json({ "error saving State": e });
  }
};

export const getStates = async (req, res) => {
  States.find({ country: req.params.country })
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

export const getState = async (req, res) => {
  States.find({ country: req.params.countryId, state: req.params.stateId })
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};

export const deleteStateById = async (req, res) => {
  const deletedState = await Countries.findByIdAndDelete(
    req.params.countryId,
    req.params.stateId,
  );
  res.status(204).json(deletedState);
};
