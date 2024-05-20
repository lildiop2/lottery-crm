import jwt from "jsonwebtoken";

class IAM {
  isAuthenticate = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Unauthorized!", expiredAt: error?.expiredAt });
    }
  };

  isAdmin = (req, res, next) => {
    try {
      let { data } = req.user;
      const roles = data.roles.map((role) => role.name);
      if (roles.includes("ROLE_ADMINISTRATOR")) {
        next();
      } else return res.status(401).json({ message: "Unauthorized!" });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  };
}

export default new IAM();
