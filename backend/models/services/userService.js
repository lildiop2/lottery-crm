import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../database.js";

const SALT = 10;

class UserService {
  createUser = async (user) => {
    const { password, ...rest } = user;
    const hash_password = await hash(password, SALT);
    return await User.create({ password: hash_password, ...rest });
  };
  getAllUsers = async () => {
    return await User.find(
      {},
      { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );
  };
  getUser = async (id) => {
    return await User.findById(id, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
  };
  updateUser = async (id, user) => {
    const { password, ...rest } = user;
    return await User.findByIdAndUpdate(
      id,
      { ...rest },
      {
        new: true,
        select: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      }
    );
  };
  deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
  };

  changePassword = async (id, oldPassword, newPassword) => {
    const user = await User.findById(id);
    if (!user) throw new Error("user not exist");
    const isMatch = await compare(oldPassword, user.password);
    if (isMatch) {
      const hash_password = await hash(newPassword, SALT);
      return await User.findByIdAndUpdate(
        id,
        { password: hash_password },
        {
          new: true,
          select: {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        }
      );
    }
    throw new Error("old password is wrong");
  };

  login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not exist");
    const isMatch = await compare(password, user.password);
    if (isMatch) {
      const tokenExpire = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // expires in 7 day 7 * 24 * 60 * 60
      const token = jwt.sign(
        {
          exp: tokenExpire,
          data: { id: user.id, roles: user.roles },
        },
        process.env.JWT_SECRET
      );

      return {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
        token,
        tokenExpire: new Date(tokenExpire * 1000),
      };
    }
    throw new Error("password or email is wrong");
  };
}

export default new UserService();
