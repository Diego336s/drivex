
import { promises } from "node:dns";
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


public async listarCarros(): Promise<CarroData[]> {
  try {
    const result = await Conexion.execute("SELECT * FROM carros");

    if (!result?.rows || result.rows.length === 0) {
      console.warn("No se encontraron carros en la base de datos.");
      return [];
    }

    return result.rows as CarroData[];
  } catch (error) {
    console.error("Error al obtener los carros:", error);
    throw new Error("No se pudieron obtener los carros.");
  }
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
    public async eliminarCarro(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!this._objCarro || this._objCarro.id === null || this._objCarro.id === undefined) {
        throw new Error("No se ha proporcionado un ID válido para eliminar el carro.");
      }

      const { id } = this._objCarro;

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "DELETE FROM carros WHERE id = ?",
        [id]
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Carro eliminado correctamente.",
        };
      } else {
        throw new Error("No se pudo eliminar el carro.");
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error interno al eliminar el carro.",
      };
    }
  }
}