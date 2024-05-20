import userService from "../models/services/userService.js";
import { body, param, validationResult } from "express-validator";

class UserController {
  //valide
  validate = (method) => {
    switch (method) {
      case "getUser": {
        return [
          param("id").exists().notEmpty().isMongoId().withMessage("invalid id"),
        ];
      }
      case "createUser": {
        return [
          body("firstname", "firstname is required").exists().trim().notEmpty(),
          body("lastname", "lastname is required").exists().trim().notEmpty(),
          body("email", "Email is required")
            .exists()
            .trim()
            .notEmpty()
            .isEmail()
            .withMessage("invalid email"),
          body("password", "password doesn't exist")
            .exists()
            .trim()
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 6 })
            .withMessage("password must have more than 6 characters"),
          body("phone").optional().isInt(),
        ];
      }
      case "updateUser": {
        return [
          param("id").exists().notEmpty().isMongoId().withMessage("invalid id"),
          body("firstname", "firstname is required")
            .optional()
            .exists()
            .trim()
            .notEmpty(),
          body("lastname", "lastname is required")
            .optional()
            .exists()
            .trim()
            .notEmpty(),
          body("email", "Email is required")
            .optional()
            .exists()
            .trim()
            .notEmpty()
            .isEmail()
            .withMessage("invalid email"),
          body("password", "password doesn't exist")
            .optional()
            .exists()
            .trim()
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 6 })
            .withMessage("password must have more than 6 characters"),
        ];
      }
      case "deleteUser": {
        return [
          param("id").exists().notEmpty().isMongoId().withMessage("invalid id"),
        ];
      }
      case "changeUserPassword": {
        return [
          param("id").exists().notEmpty().isMongoId().withMessage("invalid id"),
          body("oldPassword", "oldPassword doesn't exist")
            .exists()
            .trim()
            .notEmpty()
            .withMessage("oldPassword is required")
            .isLength({ min: 6 })
            .withMessage("oldPassword must have more than 6 characters"),
          body("newPassword", "newPassword doesn't exist")
            .exists()
            .trim()
            .notEmpty()
            .withMessage("newPassword is required")
            .isLength({ min: 6 })
            .withMessage("newPassword must have more than 6 characters"),
        ];
      }

      case "login": {
        return [
          body("email", "Email is required")
            .exists()
            .trim()
            .notEmpty()
            .isEmail()
            .withMessage("invalid email"),
          body("password", "password doesn't exist")
            .exists()
            .trim()
            .notEmpty()
            .withMessage("password is required")
            .isLength({ min: 6 })
            .withMessage("password must have more than 6 characters"),
        ];
      }
    }
  };
  //list all user
  getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      if (!users) {
        return res.status(404).json({ message: "users not found" });
      }
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { id } = req.params;
      if (!id) return res.status(404).json({ message: "user not found" });
      const user = await userService.getUser(id);
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

  //Fazer o cadastro do user
  createUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { firstname, lastname, email, password, roles } = req.body;
      const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password,
        roles,
      });
      if (!user) {
        return res.status(409).json({ message: "email already save!" });
      }
      return res.status(201).json(user);
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: error.message });
    }
  };

  //atualizar o user
  updateUser = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { ...user } = req.body;
      const updated = await userService.updateUser(id, { ...user });
      if (!updated) {
        return res.status(404).json({ mensagen: "User not found" });
      }
      return res.json(updated);
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json(error);
    }
  };
  deleteUser = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ mensagen: "User not found" });
      }
      return res.json(deleted);
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: error.message });
    }
  };
  //atualizar password do user
  changeUserPassword = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { oldPassword, newPassword } = req.body;
      const { id } = req.params;
      const updated = await userService.changePassword(
        id,
        oldPassword,
        newPassword
      );
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "password updated!" });
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: error.message });
    }
  };

  //logar
  login = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const login = await userService.login(email, password);
      if (login) {
        return res.json(login);
      }
      return res
        .status(400)
        .json({ mensagem: "Usuário ou password inválidos" });
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: error.message });
    }
  };
}

export default new UserController();
