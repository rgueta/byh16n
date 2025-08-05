import { ROLES } from "../models/Roles"; //- when have time get this roles from mongo
import Users from "../models/Users";

export const checkDuplicateUsernameEmail = async (req, res, next) => {
  const user = await Users.findOne({ username: req.body.username })
    .then((users) => {
      return res.status(400).json({ message: "Username already exists" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  Users.findOne({ email: req.body.email })
    .then((email) => {
      return res.status(400).json({ message: "Email already exists" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });

  next();
};

export const checkRolesExists = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exists`,
        });
      }
    }
  }
  next();
};
