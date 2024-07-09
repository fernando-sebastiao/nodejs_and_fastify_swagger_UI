import { app } from "../server";

export class UserController {
  async createUser() {
    app.post("/users/create", async (req, res) => {});
  }
}
