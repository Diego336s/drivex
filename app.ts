import { Application, oakCors } from "./dependencies/dependencias.ts";
import { CarrosRouter } from "./routes/CarrosRoutes.ts";

const app = new Application();

// Permitir CORS
app.use(oakCors({
  origin: "http://localhost:5173",
}));

const rutas = [CarrosRouter];
rutas.forEach((ruta) =>{
  app.use(ruta.routes());
  app.use(ruta.allowedMethods());    
});

console.log("Servidor iniciado en el puerto 8000");
app.listen({port: 8000});