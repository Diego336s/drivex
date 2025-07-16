import { Router } from "../dependencies/dependencias.ts";
import {
  deleteCarro,
  getCarros,
  postCarros,
  putCarros,
} from "../controller/CarrosController.ts";

const CarrosRouter = new Router();

CarrosRouter.get("/carros", getCarros);
CarrosRouter.post("/carros", postCarros);
CarrosRouter.put("/carros", putCarros);
CarrosRouter.delete("/carros/:id", deleteCarro);

export { CarrosRouter };
