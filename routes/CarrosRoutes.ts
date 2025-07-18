import { Router } from "../dependencies/dependencias.ts";
import {
  deleteCarro,
  getCarros,
  postCarros,
  putCarros,
  getCarroById
} from "../controller/CarrosController.ts";

const CarrosRouter = new Router();

CarrosRouter.get("/carros", getCarros);
CarrosRouter.get("/carros/:id", getCarroById);
CarrosRouter.post("/carros", postCarros);
CarrosRouter.put("/carros", putCarros);
CarrosRouter.delete("/carros/:id", deleteCarro);

export { CarrosRouter };
