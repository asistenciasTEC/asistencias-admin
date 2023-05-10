import React from "react";
import * as XLSX from "xlsx";

const ExportExcel = ({ data, fileName }) => {
  const order = [
    "id",
    "carne",
    "apellido1",
    "apellido2",
    "nombre",
    "cedula",
    "correo",
    "telefono",
    "promedioPondSemAnt",
    "créditosAproSemAnt",
    "tipoAsistencia",
    "cuentaBancaria",
    "cuentaIBAN",
    "semestresActivo",
    "profesorAsistir",
    "cursoAsistir",
    "notaCursoAsistir",
    "horario",
    "condicion",
    "horasAsignadas",
    "fecha",
  ];
  const order2 = [
    "ID",
    "Carne",
    "Primer Apellido",
    "Segundo Apellido",
    "Nombre",
    "Cédula",
    "Correo",
    "Teléfono",
    "Promedio Ponderado Semestre Anterior",
    "Créditos Aprobados Semestre Anterior",
    "Tipo Asistencia",
    "Cuenta Bancaria",
    "Cuenta IBAN",
    "Semestres Activo",
    "Profesor Asistir",
    "Curso Asistir",
    "Nota Curso Asistir",
    "Horario",
    "Condicion",
    "Horas Asignadas",
    "Fecha",
  ];


  const headers = order;
  const headerOrder = order2
  const formattedData = [
    headerOrder,
    ...data.map((item) => headers.map((header) => item[header] ?? "")),
  ];

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button className="btn btn-success" onClick={handleDownloadExcel}>
      Exportar a Excel
    </button>
  );
};

export default ExportExcel;


