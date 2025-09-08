import Users from "../models/Users";
import backstage from "../models/backstage";
import pwdRST from "../models/pwdRST";
import { Schema, Types } from "mongoose";

export const createBackstage = async (req, res) => {
  const { name, username, email, sim, house, device, gender, note } =
    await req.body;

  console.log("Send to: ", req.body.email);

  const cpu = new Types.ObjectId(req.body.cpu);
  const core = new Types.ObjectId(req.body.core);
  const demoMode = req.body.demoMode;

  try {
    if (!demoMode) {
      // Verify if just testing like demoMode
      // Find this email in users collection
      const foundStage = await backstage.findOne({ email: req.body.email });

      if (foundStage) {
        res
          .status(303)
          .json({ status: 303, msg: "Ya existe correo en backstage" });
        return;
      }

      // Find this email in pwdrsts collection
      const foundRST = await pwdRST.findOne({ email: req.body.email });

      if (foundRST) {
        res
          .status(303)
          .json({ status: 303, msg: "Ya existe correo en pwdrsts" });
        return;
      }

      // Find this email in users collection
      const foundUser = await Users.findOne({ email: req.body.email });

      if (foundUser) {
        res.status(504).json({ status: 504, msg: "Ya existe correo en users" });
        return;
      }
    }
    const newBackstage = new backstage({
      cpu,
      core,
      name,
      username,
      email,
      sim,
      house,
      device,
      gender,
      note,
    });

    const backstageSaved = await newBackstage.save();
    res
      .status(200)
      .json({ status: 200, msg: "Backstage saved", result: backstageSaved });
  } catch (err) {
    return res.status(501).json({ status: 501, msg: err.message });
  }
};

export const getBackstage = async (req, res) => {
  try {
    await backstage
      .aggregate([
        {
          $lookup: {
            from: "cpus",
            localField: "cpu",
            foreignField: "_id",
            as: "cpus",
          },
        },
        { $unwind: { path: "$cpus" } },
        {
          $lookup: {
            from: "cores",
            localField: "core",
            foreignField: "_id",
            as: "cores",
          },
        },
        { $unwind: { path: "$cores" } },
        {
          $project: {
            cpu: 1,
            core: 1,
            cpuName: "$cpus.name",
            coreName: "$cores.name",
            coreSim: "$cores.Sim",
            name: 1,
            username: 1,
            house: 1,
            email: 1,
            sim: 1,
            uuid: 1,
            gender: 1,
            path: {
              $concat: [
                "$cores.country",
                ".",
                "$cores.state",
                ".",
                "$cores.city",
                ".",
                { $toString: "$cores.division" },
                ".",
                "$cores.cpu",
                ".",
                "$cores.shortName",
              ],
            },
            note: 1,
            updatedAt: {
              $dateToString: {
                format: "%Y/%m/%d %H:%M:%S",
                date: "$updatedAt",
                timezone: "America/Los_Angeles",
              },
            },
          },
        },
      ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.status(301).json({ msg: err });
      });
  } catch (err) {
    console.log("Error -->", err);
    return res.status(501).json({ error: err.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const deletedBackstage = await backstage.findByIdAndDelete(
      req.params.backstageId,
    );
    res.status(200).json(deletedBackstage);
  } catch (err) {
    res.status(501).json({ "error: ": err });
  }
};
