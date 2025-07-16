import { Client } from "../dependencies/dependencias.ts";

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "carros",
    password:"",
})
