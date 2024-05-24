import { app } from "../server";
import { ProductRoutes } from "./product/@ProductRoutes";
import { UserRoutes } from "./users/@UserRoutes";

export const routes = async () => {
  app.register(ProductRoutes);
  app.register(UserRoutes);
};
