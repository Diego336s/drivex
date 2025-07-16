
import { Conexion } from "./Conexion.ts";
interface CarroData {
  id: number | null;
  marca: string;
  modelo: string;
  fecha: number;
  
}

export class Carro {
  public _objCarro: CarroData | null;

  constructor(objCarro: CarroData | null = null) {
    this._objCarro = objCarro;
  }

  public async agregarCarro(): Promise<{
    success: boolean;
    message: string;
    carro?: Record<string, unknown>;
  }> {
    try {
      if (!this._objCarro) {
        throw new Error("No se proporciono informacion del carro");
      }

      const {
        marca,
        modelo,
        fecha,
      } = this._objCarro;
      if (!marca || !modelo || !fecha) {
        throw new Error("Faltan datos requeridos para agregar el carro");
      }
      await Conexion.execute("START TRANSACTION");
      const resultado = await Conexion.execute(
        "INSERT INTO carros(marca, modelo, fecha) values(?, ?, ?)",
        [
          marca,
          modelo,
          fecha,
        ],
      );
      if (
        resultado && typeof resultado.affectedRows === "number" &&
        resultado.affectedRows > 0
      ) {
        const [carro] = await Conexion.query(
          "SELECT * FROM carros WHERE id  = LAST_INSERT_ID()",
        );
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Carro agregado correctamente",
          carro: carro,
        };
      } else {
        throw new Error("No se pudo agregar el carro");
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          message: "Error interno del servidor: " + String(error),
        };
      }
    }
  }
}
