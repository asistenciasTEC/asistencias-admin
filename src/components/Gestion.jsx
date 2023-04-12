import { useState, useEffect } from "react";
import { collection, query, where, serverTimestamp, getDocs, addDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from 'uuid';

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import { MdAddBox, MdEdit, MdDelete, MdSearch, IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/md";

const Gestion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [dataForm, setDataForm] = useState({
    id: "",
    tipoAsistencia: "",
    cedula: "",
    carne: "",
    apellido1: "",
    apellido2: "",
    nombre: "",
    promedioPondSemAnt: "",
    créditosAproSemAnt: "",
    correo: "",
    telefono: "",
    cuentaBancaria: "",
    cuentaIBAN: "",
    profesorAsistir: "",
    cursoAsistir: "",
    notaCursoAsistir: "",
    horario: "",
    boleta: "",
    fecha: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [periodoAEliminar, setPeriodoAELiminar] = useState("");

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
    correo,
    telefono,
    cuentaBancaria,
    cuentaIBAN,
    profesorAsistir,
    cursoAsistir,
    notaCursoAsistir,
    horario,
    boleta,
    fecha
  } = dataForm;

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const querySolicitudesCollection = query(collection(db, "solicitudes"), orderBy("fecha", "desc"));
      const snapshot = await getDocs(querySolicitudesCollection);
      const listaSolicitudes = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setSolicitudes(listaSolicitudes);
    };
    obtenerSolicitudes();
  }, []);

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value
    })
  }

  const handleDeleteClick = (id) => {
    setPeriodoAELiminar(id);
    setShowModalEliminar(true);
  };

  const handleConfirmClick = () => {
    eliminarPeriodo(periodoAEliminar);
    setShowModalEliminar(false);
  };

  const abrirModal = (accion, id) => {
    if (accion === "agregar") {
      setModalTitle("Agregar periodo");
      setModalAction("Agregar");
      setDataForm({
        id: "",
        year: "",
        semestre: "",
        horasAsistente: "",
        horasEspecial: "",
        horasEstudiante: "",
        horasTutoria: "",
        fecha: ""
      });

    } else if (accion === "editar") {
      const periodo = solicitudes.find((periodo) => periodo.id === id);
      setModalTitle("Editar periodo");
      setModalAction("Guardar cambios");
      setDataForm({
        id: periodo.id,
        year: periodo.year,
        semestre: periodo.semestre,
        horasAsistente: periodo.horasAsistente,
        horasEspecial: periodo.horasEspecial,
        horasEstudiante: periodo.horasEstudiante,
        horasTutoria: periodo.horasTutoria,
        fecha: periodo.fecha
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  function buscarPeriodo(year, semestre) {
    for (let index = 0; index < solicitudes.length; index++) {
      console.log(solicitudes[index].year, solicitudes[index].semestre)
    }

    for (let i = 0; i < solicitudes.length; i++) {
      if (solicitudes[i].year === year && solicitudes[i].semestre === semestre) {
        return solicitudes[i];
      }
      return null;
    }
  }

  //CRUD
  
  const aceptarSolicitud = async (id) => {
  };

  const rechazarSolicitud = async (id) => {

  };

  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(solicitudes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = solicitudes.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //Busqueda

  //Orden


  return (
    <div className="container-lg ">
      <h1>Gestion
      
      </h1>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col">
              <Form.Select defaultValue="0" aria-label="Default select example" >
                <option value="0" disabled="disabled">Ordenar por:</option>
                <option value="1">Año</option>
                <option value="2">Semestre</option>
                <option value="3">Horas Asistente</option>
                <option value="4">Horas Especial</option>
                <option value="5">Horas Estudiante</option>
                <option value="6">Horas Tutoria</option>
              </Form.Select>
            </div>
            <div className="col">
              <Form className="d-sm-flex">
                <Form.Control
                  type="search"
                  placeholder="Buscar..."
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="success">
                  <MdSearch />
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="table-dark table-bg-scale-50">
          <tr>
            <th>Año</th>
            <th>Semestre</th>
            <th>Horas Asistente</th>
            <th>Horas Especial</th>
            <th>Horas Estudiante</th>
            <th>Horas Tutoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((periodo) => (
            <tr key={periodo.id}>
              <td>{periodo.year}</td>
              <td>{periodo.semestre}</td>
              <td>{periodo.horasAsistente}</td>
              <td>{periodo.horasEspecial}</td>
              <td>{periodo.horasEstudiante}</td>
              <td>{periodo.horasTutoria}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="warning"
                  onClick={() => abrirModal("editar", periodo.id)}
                >
                  <MdEdit />
                </Button>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="danger"
                  onClick={() => handleDeleteClick(periodo.id)}
                >
                  <MdDelete />
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

      <Modal
        show={showModalEliminar}
        onHide={() => setShowModalEliminar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar este periodo?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalEliminar(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmClick}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1" onSubmit={id ? editarPeriodo : agregarPeriodo}>
            <Form.Group className="mb-3" controlId="year">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                min={1000}
                max={9999}
                placeholder="Escribe el año del periodo"
                value={year}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="semestre">
              <Form.Label>Semestre</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={2}
                placeholder="Escribe el semestre del periodo"
                value={semestre}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="horasAsistente">
              <Form.Label>Horas Asistente</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe la cantidad de horas asistente"
                value={horasAsistente}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="horasEspecial">
              <Form.Label>Horas Especial</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe la cantidad de horas especial"
                value={horasEspecial}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="horasEstudiante">
              <Form.Label>Horas Estudiante</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe la cantidad de horas estudiante"
                value={horasEstudiante}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="horasTutoria">
              <Form.Label>Horas Tutoría</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe la cantidad de horas tutoria"
                value={horasTutoria}
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="form1" variant="primary" type="submit">
            {modalAction}
          </Button>{" "}
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>{" "}
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Gestion