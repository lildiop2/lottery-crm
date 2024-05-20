import userService from "./models/services/userService.js";

(async () => {
  try {
    const newUser = await userService.createUser({
      name: "John3",
      email: "john3@doe.com",
    });
    console.log({ newUser });
    const users = await userService.getAllUsers();
    console.log({ users });
  } catch (error) {
    console.log(error);
  }
})();
