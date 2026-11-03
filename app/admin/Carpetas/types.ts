export interface Carpeta {

  id: number

  anio: number

  mes: number

  categoria: string

  in_amount: number

  out_amount: number

  cash: number

}

export interface Movimiento {

  id: number

  Fecha: string

  Categoria: string

  Subcategoria: string

  Descripcion: string

  Importe: number

  Usuario: string

}