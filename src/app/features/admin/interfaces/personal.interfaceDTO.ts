// Representa los datos que enviamos al crear una persona
export interface PersonalDTO {
  codp?: number;
  nombre?: string;
  ap?: string;
  am?: string;
  fnac?: Date;
  ecivil?: string;
  genero?: string;
  direc?: string;
  telf?: string;
  tipo?: string;
  foto?:string | null;
  cedula?: string;
}