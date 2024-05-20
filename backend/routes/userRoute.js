import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import iam from "../middlewares/iam.js";

router.post(
  "/user",
  userController.validate("createUser"),
  userController.createUser
);
router.get("/user", userController.getAllUsers);
router.get(
  "/user/:id",
  userController.validate("getUser"),
  userController.getUser
);
router.put(
  "/user/:id",
  userController.validate("updateUser"),
  userController.updateUser
);
router.put(
  "/user/:id/password",
  userController.validate("changeUserPassword"),
  iam.isAuthenticate,
  userController.changeUserPassword
);
router.delete(
  "/user/:id",
  userController.validate("deleteUser"),
  userController.deleteUser
);
router.post("/login", userController.validate("login"), userController.login);
export default router;
