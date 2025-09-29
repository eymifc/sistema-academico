export interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
}

export interface Menu {
  codm: number;
  nombre: string;
  procesos: Proceso[];
}