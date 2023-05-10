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

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

  // Establecer estilos para el header
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "CCCCCC" } },
  };
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let col = headerRange.s.c; col <= headerRange.e.c; ++col) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
    worksheet[headerCell].s = headerStyle;
  }

  // Establecer formato de número para las celdas
  const dataRange = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = dataRange.s.r + 1; row <= dataRange.e.r; ++row) {
    for (let col = dataRange.s.c; col <= dataRange.e.c; ++col) {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      const value = worksheet[cell].v;
      const format = typeof value === "number" ? "0.00" : null; // Establecer formato de número con dos decimales

      if (format) {
        worksheet[cell].z = format;
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const handleDownloadExcel = () => {
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button onClick={handleDownloadExcel}>
      Exportar a Excel
    </button>
  );
};

export default ExportExcel;
