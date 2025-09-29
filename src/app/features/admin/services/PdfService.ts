import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Personal } from '../interfaces/personal.interface'; 

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarPdfPersona(persona: Personal): void {
    const doc = new jsPDF();


    doc.setFontSize(18);
    doc.text('Reporte de Datos Personales', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const fecha = new Date().toLocaleDateString('es-ES');
    doc.text(`Fecha de Generación: ${fecha}`, 14, 30);

    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);


    autoTable(doc, {
      startY: 40,
      head: [['Campo', 'Valor']],
      body: [
        ['Código', persona.codp.toString()],
        ['Nombre Completo', `${persona.nombre} ${persona.ap} ${persona.am}`],
        ['Fecha de Nacimiento', new Date(persona.fnac).toLocaleDateString('es-ES')],
        ['Estado Civil', this.formatearEstadoCivil(persona.ecivil)],
        ['Género', persona.genero === 'M' ? 'Masculino' : 'Femenino'],
        ['Dirección', persona.direc || 'N/A'],
        ['Teléfono', persona.telf || 'N/A'],
        ['Tipo de Personal', this.formatearTipo(persona.tipo)],
        ['Estado de la Persona', persona.estado === 1 ? 'Activo' : 'De Baja'],
      ],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
      }
    });

    // con esto abre el navegador
    doc.output('dataurlnewwindow');
  }

  private formatearEstadoCivil(ecivil: string): string {
    switch (ecivil) {
      case 'S': return 'Soltero(a)';
      case 'C': return 'Casado(a)';
      case 'D': return 'Divorciado(a)';
      default: return 'No especificado';
    }
  }

  private formatearTipo(tipo: string): string {
    switch (tipo) {
      case 'E': return 'Estudiante';
      case 'P': return 'Profesor';
      case 'A': return 'Administrativo';
      default: return 'No especificado';
    }
  }
}