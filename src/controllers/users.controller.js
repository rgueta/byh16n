import { expectedError } from "@babel/core/lib/errors/rewrite-stack-trace";
import Users from "../models/Users";
import Cores from "../models/cores";
import { Types } from "mongoose";

const newObjectId = new Types.ObjectId();

export const createUser = async (req, res) => {
  console.log("Create User -->", req.body);
  const roles = req.body.roles.map(Types.ObjectId);
  const pwd = await Users.encryptPassword(req.body.pwd);

  return;

  try {
    const {
      name,
      email,
      username,
      house,
      uuid,
      sim,
      gender,
      avatar,
      core,
      location,
    } = await req.body;

    const foundUser = await Users.findOne({ email: req.body.email });
    if (!foundUser) {
      const newUser = new Users({
        name,
        email,
        username,
        house,
        uuid,
        sim,
        gender,
        avatar,
        roles,
        pwd,
        core,
        location,
      });

      const userSaved = await newUser.save();

      res.status(200).send({ status: 200, msg: "User saved" });
    } else {
      console.log("User already exists -> " + JSON.stringify(foundUser));
      res.status(200).send({ status: 201, msg: "User already exists" });
    }
  } catch (err) {
    return res.status(501).send({ status: 501, msg: err.message });
  }
};

export const updSim = async (req, res) => {
  const userId = req.body.userId;
  const newSim = req.body.newSim;

  const userFound = Users.findById(userId);
  if (userFound) {
    Users.findByIdAndUpdate(
      userId,
      { $set: { sim: newSim } },
      (err, result) => {
        if (err) res.status(502).json({ msg: "Can not update sim, " + err });
        console.log("result: ", result);
        res.status(200).send(result);
      },
    );
  } else {
    res.status(501).send({ msg: "user not exists" });
  }
};

export const updRoles = async (req, res) => {
  const userId = req.body.userId;
  const roles = req.body.roles.map(Types.ObjectId);

  const userFound = Users.findById(req.body.userId);
  if (userFound) {
    Users.findByIdAndUpdate(
      userId,
      { $set: { roles: roles } },
      (err, result) => {
        if (err) res.status(502).json({ msg: "Can not update roles" + err });

        console.log("result: ", result);
        res.status(200).send(result);
      },
    );
  } else {
    res.status(501).send({ msg: "user not exists" });
  }
};

export const newUser = async (req, res) => {
  const core = new Types.ObjectId(req.body.core);

  const locked = false;
  let pwd = "";
  let location = "";
  const { name, email, username, house, uuid, sim, gender, avatar, roles } =
    await req.body;

  if (location == "") {
    const tmpCores = await Cores.aggregate([
      {
        $match: { _id: core },
      },
      {
        $project: {
          _id: 0,
          location: {
            $concat: [
              "$country",
              ".",
              "$state",
              ".",
              "$city",
              ".",
              { $toString: "$division" },
              ".",
              "$cpu",
              ".",
              "$shortName",
            ],
          },
        },
      },
    ])
      .then((tmpCores) => {
        location = tmpCores[0].location;
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.status(301).json({ error: err });
      });
  }

  try {
    const foundUser = await Users.findOne({ email: req.body.email });

    if (!foundUser) {
      const newUser = new Users({
        name,
        email,
        username,
        pwd,
        core,
        house,
        uuid,
        sim,
        gender,
        avatar,
        roles,
        locked,
        location,
      });

      const userSaved = await newUser.save();

      res.status(200).send(userSaved);
    } else {
      res.status(409).send({ status: 409, msg: "email already exists" });
    }
  } catch (err) {
    return res.status(501).send({ status: 501, msg: err.message });
  }
};

export const RegisterUser = async (req, res) => {
  console.log("RegisterUser -->", req.body);
};

export const getUsers = async (req, res) => {
  const users = await Users.find();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  console.log(req.params.userId);
  res.status(200).json(user);
};

export const getUserByCore = async (req, res) => {
  const query = { core: new Types.ObjectId(String(req.params.coreId)) };
  const fields = {};
  const mySort = { house: 1 };
  try {
    await Users.aggregate([
      {
        $match: {
          core: new Types.ObjectId(String(req.params.coreId)),
        },
      },
      { $sort: { house: 1 } },
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "_id",
          as: "roles_user",
        },
      },
      {
        $lookup: {
          from: "cores",
          localField: "core",
          foreignField: "_id",
          as: "cores_user",
        },
      },
      {
        $unwind: {
          path: "$cores_user",
        },
      },
      {
        $project: {
          core: 1,
          email: 1,
          gender: 1,
          house: 1,
          location: 1,
          locked: 1,
          name: 1,
          open: 1,
          roles: "$roles_user.name",
          sim: 1,
          username: 1,
          uuid: 1,
          coreSim: "$cores_user.Sim",
        },
      },
    ])
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.log("catch aggregation --> ", err);
        res.status(300).json({ msg: "NO data found" });
      });
  } catch (ex) {
    console.log("catch --> ", ex);
    res.status(501).json(ex);
  }
};

export const getUserByCoreNeighbor = async (req, res) => {
  const query = { core: newObjectId(req.params.coreId) };
  const fields = {};
  const mySort = { house: 1 };

  try {
    await Users.aggregate([
      {
        $match: {
          core: newObjectId(req.params.coreId),
        },
      },
      { $sort: { house: 1 } },
      {
        $lookup: {
          from: "roles",
          localField: "roles",
          foreignField: "_id",
          as: "roles_user",
        },
      },
      {
        $lookup: {
          from: "cores",
          localField: "core",
          foreignField: "_id",
          as: "cores_user",
        },
      },
      {
        $unwind: {
          path: "$cores_user",
        },
      },
      { $match: { "roles_user.level": { $nin: [1, 2] } } },
      {
        $project: {
          core: 1,
          email: 1,
          gender: 1,
          house: 1,
          location: 1,
          locked: 1,
          name: 1,
          open: 1,
          roles: "$roles_user.name",
          sim: 1,
          username: 1,
          uuid: 1,
          coreSim: "$cores_user.Sim",
        },
      },
    ])
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(300).json({ msg: "NO data found" });
      });
  } catch (ex) {
    res.status(501).json(ex);
  }
};

export const updateUserById = async (req, res) => {
  const updatedUser = await Users.findByIdAndUpdate(
    req.params.userId,
    req.body,
    { new: true },
  );
  res.status(200).json(updatedCode);
};

export const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.delUserId);
    res.status(200).json(deletedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const lockUser = async (req, res) => {
  const userId = newObjectId(req.body.neighborId);
  try {
    const updLocked = await Users.updateOne(
      { _id: userId },
      { $set: { locked: true } },
    );
    if (updLocked) res.status(200).json({ msg: updLocked });
    else
      res.status(501).json({ msg: "Can not locked user [ " + userId + " ]" });
  } catch (err) {
    res.status(501).json({ msg: err });
  }
};

export const unlockUser = async (req, res) => {
  const userId = req.body.neighborId;
  try {
    const updUnlocked = await Users.updateOne(
      { _id: newObjectId(userId) },
      { $set: { locked: false } },
    );
    if (updUnlocked) res.status(200).json({ msg: updUnlocked });
    else
      res.status(501).json({ msg: "Can not unlocked user [ " + userId + " ]" });
  } catch (err) {
    res.status(501).json({ msg: err });
  }
};

export const notLockUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await Users.find(
      { _id: newObjectId(userId), locked: false },
      async (err, result) => {
        if (result == "") {
          res.status(501).json({ msg: "is locked" });
        } else {
          res.status(200).json({ msg: "is ok" });
        }
      },
    );
  } catch (err) {
    res.status(501).json({ msg: err });
  }
};

export const getFamily = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  if (user) {
    try {
      await Users.aggregate(
        [
          {
            $match: {
              house: user.house,
              core: newObjectId(user.core),
              _id: { $ne: newObjectId(user._id) },
            },
          },
          {
            $project: {
              name: 1,
              sim: 1,
            },
          },
        ],
        async function (err, result) {
          if (err || result == "")
            return res
              .status(301)
              .json({ ErrMsg: "Usuarios no encontrados", Error: err });
          return res.status(200).json(result);
        },
      );
    } catch (ex) {
      res.status(301).json({ error: ex });
    }
  } else {
    res.status(301).json({ msg: "El usario no se encuentra" });
  }
};
