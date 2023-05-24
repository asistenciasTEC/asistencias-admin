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
  const horariosList = [];
  data.forEach((item) => {
    let horarioString = "";

    const horario = item.horario;
    const diasSemana = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];

    diasSemana.forEach((dia) => {
      const matriz = horario[dia];
      if (matriz && Array.isArray(matriz)) {
        const diaString = `${dia}: ${matriz.join(", ")} || `;
        horarioString += diaString;
      }
    });

    horariosList.push(horarioString);
  });
  const headers = order;
  const headerOrder = order2;
  const formattedData = [
    headerOrder,
    ...data.map((item, index) => {
      const rowData = headers.map((header) => item[header] ?? "");
      rowData[headers.indexOf("horario")] = horariosList[index]; // Insertar horarioList en la columna de horario
      return rowData;
    }),
  ];

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Crear la primera hoja de cálculo
    const worksheet1 = XLSX.utils.aoa_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet1, "data1");
    // Crear la segunda hoja de cálculo

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button className="btn btn-success" onClick={handleDownloadExcel}>
      Exportar a Excel
    </button>
  );
};

export default ExportExcel;
