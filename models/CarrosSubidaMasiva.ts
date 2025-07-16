import { Conexion } from "./Conexion.ts";
import { ensureDir } from "../dependencies/dependencias.ts";

export class CarroSubidaMasiva {
  _objCarror: unknown;

  constructor(objCarror: unknown) {
    this._objCarror = objCarror;
  }
  public async agregarMasivamente() {
    const CARPETA_UPLOAD = "./uploads";

    try {
        await ensureDir(CARPETA_UPLOAD);
    } catch (error) {
        // Si la carpeta existe no pasa nada
    }

    



  }
}
