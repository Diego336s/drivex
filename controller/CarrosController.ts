import { Context, RouterContext, z } from "../dependencies/dependencias.ts";
import { Carro } from '../models/CarrosModel.ts';

const CarrosSchema = z.object({
  marca: z.string().min(1),
  modelo: z.string().min(1),
  
});

export const getCarros = async (ctx: Context) => {
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

export const deleteCarros = async (ctx: RouterContext<"/carros/:id">) => {
};
