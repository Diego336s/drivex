import { Context, RouterContext, z } from "../dependencies/dependencias.ts";

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

    const resultado;

    if (!archivo) {
      const marca = body.get("marca") as string;
      const modelo = body.get("modelo") as string;
      const fecha = body.get("fecha") as Date | null;

      const validacion = CarrosSchema.parse({
        marca,
        modelo,
        fecha,
      });

      const datos_a_enviar = {
        ...validacion
      };

      if(resultado){        
        response.status = 200;
        response.body = {
          success: true,
          message: "Carro agregado correctamente",
          data: resultado,
        };
        return;
      }else{
response.status = 400;
response.body ={
    success: false,
    mes
}
      }
      
      
    }
  } catch (error) {
  }
};

export const putCarros = async (ctx: Context) => {
};

export const deleteCarros = async (ctx: RouterContext<"/carros/:id">) => {
};
