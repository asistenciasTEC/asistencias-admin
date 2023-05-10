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
    "profesorAsistir",
    "cursoAsistir",
    "notaCursoAsistir",
    "horario",
    "boleta",
    "condicion",
    "horasAsignadas",
    "fecha",
  ];

  const headers = order;
  const formattedData = [
    headers,
    ...data.map((item) => headers.map((header) => item[header] ?? "")),
  ];

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button onClick={handleDownloadExcel}>
      Exportar a Excel
    </button>
  );
};

export default ExportExcel;


