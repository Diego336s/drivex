import { Context, RouterContext, XLSX, z } from "../dependencies/dependencias.ts";
import { Carro } from '../models/CarrosModel.ts';
import { CarroSubidaMasiva } from "../models/CarrosSubidaMasiva.ts";

const CarrosSchema = z.object({
  marca: z.string().min(1),
  modelo: z.string().min(1),
  
});

export const getCarros = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objCarro = new Carro();
    const carros = await objCarro.listarCarros();

    response.status = 200;
    response.body = {
      success: true,
      message: "Carros encontrados exitosamente",
      data: carros,
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: "Error al obtener el Carro: " + String(error),
    };
  }
};


export const getCarroById = async (ctx: RouterContext<"/carros/:id">) => {
  const id = Number(ctx.params.id);

  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: "ID de carro inválido.",
    };
    return;
  }

  try {
    const producto = new Carro();
    const result = await producto.ObtenerCarroPorId(id);

    if (!result) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        message: "Carro no encontrado.",
      };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: "Error interno del servidor",
      error: String(error),
    };
  }
};


export const postCarros = async (ctx: Context) => {
  const { request, response } = ctx;
  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "La cabecera de la  solicitud esta vacia",
      };
      return;
    }

    const body = await request.body.formData();

    const archivo = body.get("excel") as File;  

    if (!archivo) {
      const marca = body.get("marca") as string;
      const modelo = body.get("modelo") as string;
      const fecha = body.get("fecha") as string;

      const validacion = CarrosSchema.parse({
        marca,
        modelo,
        
       
      });

      const datos_a_enviar = {
        id: null,
        ...validacion,     
        fecha: Number(fecha),  
      };

      const objCarro = new Carro(datos_a_enviar);
      const resultado = await objCarro.agregarCarro();

      if (resultado) {
        response.status = 200;
        response.body = {
          success: true,
          message: "Carro agregado correctamente",
          data: resultado,
        };
        return;
      } else {
        response.status = 400;
        response.body = {
          success: false,
          message:"Error al agregar el carro: " + resultado,
        };
        return;
      }
    }

    if(archivo instanceof File && archivo.name.endsWith(".xlsx")){
      const arrayBuffer = await archivo.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {type: "array"});

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const objCarro = new CarroSubidaMasiva(data);
      const resultado  = await objCarro.agregarMasivamente();
    }else{
      response.status = 400;
      response.body = {
        success: false,
        message: "El archivo debe ser un archivo Excel (.xlsx)",
      };
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError){
      response.status = 500;
      response.body = {
        success: false,
        message: "Datos invalidos: " + error.message,
      }
    }else{
      response.status = 500;
      response.body = {
        success: false,
        message: "Error del servidor: " + String(error),
      }
    }
  }

};

export const putCarros = async (ctx: Context) => {
};

export const deleteCarro = async (ctx: RouterContext<"/carros/:id">) => {
  const { response, params } = ctx;
  try {
    if (!params?.id) {
      response.status = 400;
      response.body = {
        success: false,
        message: "ID requerido",
      };
      return;
    }

    const objCarro = new Carro({
      id: parseInt(params.id),
      marca: "",
    modelo: "",
      fecha: 0
    });

    const result = await objCarro.eliminarCarro();

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        message: result.message,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: result.message,
      };
    }
  } catch (error) {
    console.error("Error al eliminar carro:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno del servidor.",
    };
  }
};

