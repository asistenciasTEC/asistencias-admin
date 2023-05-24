import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase/firebase";

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdInfo } from "react-icons/md";
import ExportExcel from "./exportExcel";

const Gestion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [dataForm, setDataForm] = useState({
    id: "",
    idPeriodo: "",
    tipoAsistencia: "",
    cedula: "",
    carne: "",
    apellido1: "",
    apellido2: "",
    nombre: "",
    promedioPondSemAnt: "",
    créditosAproSemAnt: "",
    semestresActivo: "",
    correo: "",
    telefono: "",
    tipoCuenta: "",
    cuentaBancaria: "",
    cuentaIBAN: "",
    profesorAsistir: "",
    cursoAsistir: "",
    notaCursoAsistir: "",
    horario: "",
    boleta: "",
    condicion: "",
    horasAsignadas: "",
    fecha: ""
  });

  const [periodoActivo, setPeriodoActivo] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [resultados, setResultados] = useState([]);
  const [valorSeleccionado, setValorSeleccionado] = useState("");

  const {
    id,
    tipoAsistencia,
    cedula,
    carne,
    apellido1,
    apellido2,
    nombre,
    promedioPondSemAnt,
    créditosAproSemAnt,
    semestresActivo,
    correo,
    telefono,
    tipoCuenta,
    cuentaBancaria,
    cuentaIBAN,
    profesorAsistir,
    cursoAsistir,
    notaCursoAsistir,
    horario,
    boleta,
    condicion,
    horasAsignadas,
    fecha
  } = dataForm;

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value
    })
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      const querySolicitudesCollection = query(collection(db, "solicitudes"), orderBy("fecha", "desc"));
      const queryPeriodo = query(collection(db, "periodos"), where("estado", "==", true));

      const [snapshotSolicitudes, snapshotPeriodo] = await Promise.all([
        getDocs(querySolicitudesCollection),
        getDocs(queryPeriodo)
      ]);

      const listaSolicitudes = snapshotSolicitudes.docs.map((doc) => ({
        ...doc.data(),
      }));
      setSolicitudes(listaSolicitudes);

      if (!snapshotPeriodo.empty) {
        const documento = snapshotPeriodo.docs[0];
        setPeriodoActivo(documento.data())
      } else {
        console.log("Error: No hay periodo activo");
      }
    };
    obtenerDatos();
  }, []);


  const marcarCasillasHorario = (horario) => {
    const checkboxes = document.querySelectorAll("#horario input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
      const [dia, intervalo] = checkbox.id.split("-");
      const isChecked = horario[dia].includes(intervalo);
      checkbox.checked = isChecked;
    });
  };

  const abrirModal = (id) => {
    const solicitud = solicitudes.find((solicitud) => solicitud.id === id);
    setModalTitle("Informacion de la solicitud");
    setDataForm({
      id: solicitud.id,
      tipoAsistencia: solicitud.tipoAsistencia,
      cedula: solicitud.cedula,
      carne: solicitud.carne,
      apellido1: solicitud.apellido1,
      apellido2: solicitud.apellido2,
      nombre: solicitud.nombre,
      promedioPondSemAnt: solicitud.promedioPondSemAnt,
      créditosAproSemAnt: solicitud.créditosAproSemAnt,
      semestresActivo: solicitud.semestresActivo,
      correo: solicitud.correo,
      telefono: solicitud.telefono,
      tipoCuenta: solicitud.tipoCuenta,
      cuentaBancaria: solicitud.cuentaBancaria,
      cuentaIBAN: solicitud.cuentaIBAN,
      profesorAsistir: solicitud.profesorAsistir,
      cursoAsistir: solicitud.cursoAsistir,
      notaCursoAsistir: solicitud.notaCursoAsistir,
      horario: solicitud.horario,
      boleta: solicitud.boleta,
      condicion: solicitud.condicion,
      horasAsignadas: solicitud.horasAsignadas,
      fecha: solicitud.fecha
    });
    setShowModal(true);
    if (tipoAsistencia === 'Horas Estudiantes') {
      marcarCasillasHorario(solicitud.horario);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const verificarHorasRestantes = (tipoAsistencia, horasAsignadas, periodoActivo, solicitudAnterior) => {
    const horasRestantes = tipoAsistencia === "Horas Asistente" ? parseInt(periodoActivo.horasAsistenteRes) :
      tipoAsistencia === "Asistencia Especial" ? parseInt(periodoActivo.horasEspecialRes) :
        tipoAsistencia === "Horas Estudiantes" ? parseInt(periodoActivo.horasEstudianteRes) :
          tipoAsistencia === "Tutoria Estudiantil" ? parseInt(periodoActivo.horasTutoriaRes) :
            0;

    if (parseInt(horasAsignadas) > horasRestantes + parseInt(solicitudAnterior.horasAsignadas)) {
      toast.error(`No quedan suficientes horas restantes para ${tipoAsistencia}`);
      return false;
    }
    return true;
  };

  const aceptarGestion = async (e) => {
    e.preventDefault();
    if (parseInt(horasAsignadas) > 0) {
      const solicitudActualizada = {
        id,
        tipoAsistencia,
        cedula,
        carne,
        apellido1,
        apellido2,
        nombre,
        promedioPondSemAnt,
        créditosAproSemAnt,
        semestresActivo,
        correo,
        telefono,
        tipoCuenta,
        cuentaBancaria,
        cuentaIBAN,
        profesorAsistir,
        cursoAsistir,
        notaCursoAsistir,
        horario,
        boleta,
        condicion: "Aceptado",
        horasAsignadas,
        fecha
      };

      const solicitudAnterior = solicitudes.find((solicitud) => solicitud.id === id);

      if (!verificarHorasRestantes(tipoAsistencia, horasAsignadas, periodoActivo, solicitudAnterior)) {
        return null;
      }

      const periodoActualizado = {
        id: periodoActivo.id,
        year: periodoActivo.year,
        semestre: periodoActivo.semestre,
        horasAsistente: periodoActivo.horasAsistente,
        horasEspecial: periodoActivo.horasEspecial,
        horasEstudiante: periodoActivo.horasEstudiante,
        horasTutoria: periodoActivo.horasTutoria,
        horasAsistenteRes: tipoAsistencia === "Horas Asistente" ? parseInt(periodoActivo.horasAsistenteRes) - parseInt(horasAsignadas) + parseInt(solicitudAnterior.horasAsignadas) : periodoActivo.horasAsistenteRes,
        horasEspecialRes: tipoAsistencia === "Asistencia Especial" ? parseInt(periodoActivo.horasEspecialRes) - parseInt(horasAsignadas) + parseInt(solicitudAnterior.horasAsignadas) : periodoActivo.horasEspecialRes,
        horasEstudianteRes: tipoAsistencia === "Horas Estudiantes" ? parseInt(periodoActivo.horasEstudianteRes) - parseInt(horasAsignadas) + parseInt(solicitudAnterior.horasAsignadas) : periodoActivo.horasEstudianteRes,
        horasTutoriaRes: tipoAsistencia === "Tutoria Estudiantil" ? parseInt(periodoActivo.horasTutoriaRes) - parseInt(horasAsignadas) + parseInt(solicitudAnterior.horasAsignadas) : periodoActivo.horasTutoriaRes,
        estado: periodoActivo.estado,
        fecha: periodoActivo.fecha
      };

      const queryPeri = query(collection(db, "periodos"), where("estado", "==", true));
      const querySnapshotPeri = await getDocs(queryPeri);

      querySnapshotPeri.forEach((doc) => {
        updateDoc(doc.ref, periodoActualizado);
      });

      setPeriodoActivo(periodoActualizado);

      const querySoli = query(collection(db, "solicitudes"), where("id", "==", id));
      const querySnapshotSoli = await getDocs(querySoli);

      querySnapshotSoli.forEach((doc) => {
        updateDoc(doc.ref, solicitudActualizada)
          .then(() => {
            toast.success("Solicitud aceptada exitosamente.");
          })
          .catch((error) => {
            toast.error("Ha ocurrido un error.");
          });
      });

      const listaSolicitudesActualizada = solicitudes.map((solicitud) =>
        solicitud.id === id ? { id: id, ...solicitudActualizada } : solicitud
      );
      setSolicitudes(listaSolicitudesActualizada);
      cerrarModal();
    } else {
      toast.error("No se puede aceptar sin asignar horas");
    }
  };


  const rechazarGestion = async (e) => {
    e.preventDefault();
    if (parseInt(horasAsignadas) > 0) {
      toast.error("No se puede rechazar si hay horas asignadas");
    } else {
      const solicitudActualizada = {
        id,
        tipoAsistencia,
        cedula,
        carne,
        apellido1,
        apellido2,
        nombre,
        promedioPondSemAnt,
        créditosAproSemAnt,
        semestresActivo,
        correo,
        telefono,
        tipoCuenta,
        cuentaBancaria,
        cuentaIBAN,
        profesorAsistir,
        cursoAsistir,
        notaCursoAsistir,
        horario,
        boleta,
        condicion: "Rechazado",
        horasAsignadas: 0,
        fecha
      };


      const solicitudAnterior = solicitudes.find((solicitud) => solicitud.id === id);

      const periodoActualizado = {
        id: periodoActivo.id,
        year: periodoActivo.year,
        semestre: periodoActivo.semestre,
        horasAsistente: periodoActivo.horasAsistente,
        horasEspecial: periodoActivo.horasEspecial,
        horasEstudiante: periodoActivo.horasEstudiante,
        horasTutoria: periodoActivo.horasTutoria,
        horasAsistenteRes: tipoAsistencia === "Horas Asistente" ? parseInt(periodoActivo.horasAsistenteRes) + (isNaN(parseInt(solicitudAnterior.horasAsignadas)) ? 0 : parseInt(solicitudAnterior.horasAsignadas)) : periodoActivo.horasAsistenteRes,
        horasEspecialRes: tipoAsistencia === "Asistencia Especial" ? parseInt(periodoActivo.horasEspecialRes) + (isNaN(parseInt(solicitudAnterior.horasAsignadas)) ? 0 : parseInt(solicitudAnterior.horasAsignadas)) : periodoActivo.horasEspecialRes,
        horasEstudianteRes: tipoAsistencia === "Horas Estudiantes" ? parseInt(periodoActivo.horasEstudianteRes) + (isNaN(parseInt(solicitudAnterior.horasAsignadas)) ? 0 : parseInt(solicitudAnterior.horasAsignadas)) : periodoActivo.horasEstudianteRes,
        horasTutoriaRes: tipoAsistencia === "Tutoria Estudiantil" ? parseInt(periodoActivo.horasTutoriaRes) + (isNaN(parseInt(solicitudAnterior.horasAsignadas)) ? 0 : parseInt(solicitudAnterior.horasAsignadas)) : periodoActivo.horasTutoriaRes,
        estado: periodoActivo.estado,
        fecha: periodoActivo.fecha
      };

      const queryPeri = query(collection(db, "periodos"), where("estado", "==", true));
      const querySnapshotPeri = await getDocs(queryPeri);

      querySnapshotPeri.forEach((doc) => {
        updateDoc(doc.ref, periodoActualizado);
      });

      setPeriodoActivo(periodoActualizado);

      const querySoli = query(collection(db, "solicitudes"), where("id", "==", id));
      const querySnapshotSoli = await getDocs(querySoli);

      querySnapshotSoli.forEach((doc) => {
        updateDoc(doc.ref, solicitudActualizada)
          .then(() => {
            toast.success("Solicitud rechazada exitosamente.");
          })
          .catch((error) => {
            toast.error("Ha ocurrido un error.");
          });
      });

      const listaSolicitudesActualizada = solicitudes.map((solicitud) =>
        solicitud.id === id ? { id: id, ...solicitudActualizada } : solicitud
      );
      setSolicitudes(listaSolicitudesActualizada);
      cerrarModal();
    }
  };



  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages =
    resultados.length > 0
      ? Math.ceil(resultados.length / itemsPerPage)
      : Math.ceil(solicitudes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems =
    resultados.length > 0
      ? resultados.slice(startIndex, endIndex)
      : solicitudes.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //Busqueda
  const buscarEnLista = (terminoBusqueda) => {
    const resultadosBusq = [];
    if (
      valorSeleccionado === "default" ||
      valorSeleccionado === ""
    ) {
      for (let i = 0; i < solicitudes.length; i++) {
        if (
          solicitudes[i].carne.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].apellido1.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].apellido2.toLowerCase() === terminoBusqueda.toLowerCase() ||
          (solicitudes[i].nombre + ' ' + solicitudes[i].apellido1 + ' ' + solicitudes[i].apellido2).toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].tipoAsistencia.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].cursoAsistir.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].profesorAsistir.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].condicion.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "carne") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].carne.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "nombre") {
      for (let i = 0; i < solicitudes.length; i++) {

        if (
          solicitudes[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].apellido1.toLowerCase() === terminoBusqueda.toLowerCase() ||
          solicitudes[i].apellido2.toLowerCase() === terminoBusqueda.toLowerCase() ||
          (solicitudes[i].nombre + ' ' + solicitudes[i].apellido1 + ' ' + solicitudes[i].apellido2).toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "tipoAsistencia") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].tipoAsistencia.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "cursoAsistir") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].cursoAsistir.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "profesorAsistir") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].profesorAsistir.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "condicion") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].condicion.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    } else if (valorSeleccionado === "horasAsignadas") {
      for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].horasAsignadas.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(solicitudes[i]);
        }
      }
    }
    setResultados(resultadosBusq);
  };
  const handleBusqueda = (event) => {
    const terminoBusqueda = event.target.value;
    buscarEnLista(terminoBusqueda);
  };

  function handleSelectChange(event) {
    setValorSeleccionado(event.target.value);
  }
  const solicitudesAceptadas = solicitudes.filter((objeto) => objeto.condicion === "Aceptado");

  const handleDescargarBoleta = () => {
    window.open(
      dataForm.boleta,
      '_blank'
    );
  };

  return (
    <div className="container-lg ">
      <div className="containerToTitleAndExportToExcel">
        <h1>Gestión</h1>
        <h5>
          H.A: <span style={{ color: 'red' }}>{periodoActivo.horasAsistenteRes}</span> --
          A.E: <span style={{ color: 'red' }}>{periodoActivo.horasEspecialRes}</span> --
          H.E: <span style={{ color: 'red' }}>{periodoActivo.horasEstudianteRes}</span> --
          H.T: <span style={{ color: 'red' }}>{periodoActivo.horasTutoriaRes}</span>
        </h5>
        <div>
          <ExportExcel data={solicitudesAceptadas} fileName="data.csv" />
        </div>
      </div>
      <div className="row mb-2 justify-content-end">
        <div className="col-3">
          <Form.Select aria-label="Default select example"
            onChange={handleSelectChange}>
            <option value="default">Filtros</option>
            <option value="carne">Por Carné</option>
            <option value="nombre">Por Nombre</option>
            <option value="tipoAsistencia">Por Tipo de asistencia</option>
            <option value="cursoAsistir">Por Curso a asistir</option>
            <option value="profesorAsistir">Por Profesor a asistir</option>
            <option value="condicion">Por Condición</option>
            <option value="horasAsignadas">Por Horas asignadas</option>
          </Form.Select>
        </div>
        <div className="col-3">
          <Form.Control
            type="search"
            placeholder="Buscar"
            className="me-2"
            aria-label="Search"
            onChange={handleBusqueda}
          />
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="table-dark table-bg-scale-50">
          <tr>
            <th>Carné</th>
            <th>Nombre</th>
            <th>Tipo de Asistencia</th>
            <th>Curso</th>
            <th>Profesor</th>
            <th>Condición</th>
            <th>Horas asignadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.carne}</td>
              <td>{solicitud.nombre} {solicitud.apellido1} {solicitud.apellido2}</td>
              <td>{solicitud.tipoAsistencia}</td>
              <td>{solicitud.cursoAsistir}</td>
              <td>{solicitud.profesorAsistir}</td>
              <td>{solicitud.condicion}</td>
              <td>{solicitud.horasAsignadas}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="info"
                  onClick={() => abrirModal(solicitud.id)}
                >
                  <MdInfo />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>

      <Modal show={showModal} onHide={cerrarModal} className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="apellido1">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={apellido1}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="carne">
                  <Form.Label>Carné</Form.Label>
                  <Form.Control
                    type="number"
                    value={carne}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="banco">
                  <Form.Label>Banco</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={tipoCuenta}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="number"
                    value={telefono}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="profesorAsistir">
                  <Form.Label>Profesor a Asistir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={profesorAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="promedioPondSemAnt">
                  <Form.Label>Promedio Ponderado Semestre Anterior</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={promedioPondSemAnt}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="apellido2">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={apellido2}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cedula">
                  <Form.Label>Cédula</Form.Label>
                  <Form.Control
                    type="number"
                    value={cedula}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cuentaIBAN">
                  <Form.Label>Cuenta IBAN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={cuentaIBAN}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="tipoAsistencia">
                  <Form.Label>Tipo de Asistencia</Form.Label>
                  <Form.Control
                    type="text"
                    value={tipoAsistencia}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="créditosAproSemAnt">
                  <Form.Label>Créditos Aprobados Semestre Anterior</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={créditosAproSemAnt}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="semestresActivo">
                  <Form.Label>Cantidad de Semestres Activo</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={semestresActivo}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="text"
                    value={correo}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cuentaBancaria">
                  <Form.Label>Cuenta Bancaria</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={cuentaBancaria}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>


                <Form.Group className="mb-3" controlId="cursoAsistir">
                  <Form.Label>Curso a Asistir</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="N/A"
                    value={cursoAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="notaCursoAsistir">
                  <Form.Label>Nota Curso a Asistir</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="N/A"
                    value={notaCursoAsistir}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="condicion">
                  <Form.Label>Condición</Form.Label>
                  <Form.Control
                    type="text"
                    value={condicion}
                    onChange={handleChange}
                    autoComplete='off'
                    required
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            {tipoAsistencia === 'Horas Estudiantes' && (
              <Form.Group controlId="horario">
                <Form.Label>Horario</Form.Label>
                <Table bordered>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Lunes</th>
                      <th>Martes</th>
                      <th>Miércoles</th>
                      <th>Jueves</th>
                      <th>Viernes</th>
                      <th>Sábado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>07:00 - 12:00</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.lunes.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.martes.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.miercoles.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.jueves.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.viernes.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.sabado.includes("07:00 - 12:00")}
                          disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>12:00 - 17:00</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.lunes.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.martes.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.miercoles.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.jueves.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.viernes.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.sabado.includes("12:00 - 17:00")}
                          disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>17:00 - 22:00</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.lunes.includes("17:00 - 22:00")}
                          disabled
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.martes.includes("17:00 - 22:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.miercoles.includes("17:00 - 22:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.jueves.includes("17:00 - 22:00")}
                          disabled />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.viernes.includes("17:00 - 22:00")}
                          disabled
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={horario.sabado.includes("17:00 - 22:00")}
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="boleta">
              <Button
                className="px-2 py-1 mb-2 fs-5"
                variant="success"
                onClick={handleDescargarBoleta}
              >
                Descargar Boleta
              </Button>

            </Form.Group>

            <Form.Group className="mb-3" controlId="horasAsignadas">
              <Form.Label>Horas Asignadas</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={10}
                value={horasAsignadas}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>{" "}
          <Button id="botonRechazar" form="form1" variant="danger" type="submit" onClick={rechazarGestion}>
            Rechazar
          </Button>{" "}
          <Button id="botonAceptar" form="form1" variant="success" type="submit" onClick={aceptarGestion}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Gestion