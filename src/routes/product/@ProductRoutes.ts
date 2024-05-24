import { app } from "../../server";
import { criarProduto } from "./product";

export const ProductRoutes = async () => {
  app.register(criarProduto);
};
