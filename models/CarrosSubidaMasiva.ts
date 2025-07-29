import { Conexion } from "./Conexion.ts";
import { ensureDir } from "../dependencies/dependencias.ts";
import { Carro } from "./CarrosModel.ts"; // Asegúrate de importar el modelo

export class CarroSubidaMasiva {
  _objCarror: any[][];

  constructor(objCarror: any[][]) {
    this._objCarror = objCarror;
  }

  public async agregarMasivamente() {
    const CARPETA_UPLOAD = "./uploads";

    if (!this._objCarror || this._objCarror.length === 0) {
      throw new Error("No proporcionó un objeto válido");
    }

    try {
      await ensureDir(CARPETA_UPLOAD);
    } catch {
      // Si la carpeta ya existe, no hacer nada
    }

    const [headers, ...rows] = this._objCarror;

    const errores: string[] = [];

    for (const [index, fila] of rows.entries()) {
      try {
        const obj: Record<string, any> = {};
        headers.forEach((key: string, i: number) => {
          obj[key] = fila[i];
        });
        
        const carro = new Carro({
          id: null,
          marca: obj.marca,
          modelo: obj.modelo,
          fecha: Number(obj.fecha),
        });

        await carro.agregarCarro();
      } catch (error) {
        errores.push(`Error en fila ${index + 2}: ${String(error)}`);
      }
    }

    if (errores.length > 0) {
      throw new Error(`Errores durante la inserción:\n${errores.join("\n")}`);
    }
  }
}
