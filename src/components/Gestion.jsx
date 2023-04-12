import { useState, useEffect } from "react";
import { collection, query, where, serverTimestamp, getDocs, addDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from 'uuid';

//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";

//librería de iconos boostrap para react
import {MdInfo, MdSearch, IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/md";

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
    condicion: "",
    horasAsignadas: 0,
    fecha: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

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
    condicion,
    horasAsignadas,
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

  const abrirModal = (id) => {
    const solicitud = solicitudes.find((solicitud) => solicitud.id === id);
      setModalTitle("Informacion de la solicitud");
      setDataForm({
        id: solicitud.id,
        tipoAsistencia: solicitud.tipoAsistencia,
        cedula: solicitud.cedula,
        carne:  solicitud.carne,
        apellido1: solicitud.apellido1,
        apellido2: solicitud.apellido2,
        nombre: solicitud.nombre,
        promedioPondSemAnt: solicitud.promedioPondSemAnt,
        créditosAproSemAnt: solicitud.créditosAproSemAnt,
        correo: solicitud.correo,
        telefono: solicitud.telefono,
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
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const gestionSolicitud = async (e) => {
    e.preventDefault();
    console.log("Hola")
    console.log(cedula)
    if (horasAsignadas !== 0) {
      const solicitudActualizada = { id,
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
        condicion: "Aceptado",
        horasAsignadas,
        fecha };
      const q = query(collection(db, "solicitudes"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, solicitudActualizada)
          .then(() => {
            toast.success("solicitud aceptada exitosamente.");
          })
          .catch((error) => {
            toast.error("Ha ocurrido un error.");
          });
      });
      const listaSolicitudesActualizada = solicitudes.map((solicitud) =>
        solicitud.id === id ? { id: id, ...solicitudActualizada } : solicitud
      );
      setSolicitudes(listaSolicitudesActualizada);
    } else {
      const solicitudActualizada = { id,
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
        condicion: "Rechazado",
        horasAsignadas,
        fecha };
      const q = query(collection(db, "solicitudes"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
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
    }
    cerrarModal();
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
                <option value="3">Nombre estudiante</option>
                <option value="4">Curso</option>
                <option value="5">Profesor</option>
                <option value="6">Tipo de asistencia</option>
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
            <th>Carné</th>
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

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1" onSubmit={gestionSolicitud}>
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

            <Form.Group className="mb-3" controlId="cedula">
              <Form.Label>Cedula</Form.Label>
              <Form.Control
                type="number"
                value={cedula}
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

            <Form.Group className="mb-3" controlId="apellido1">
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

            <Form.Group className="mb-3" controlId="créditosAproSemAnt">
              <Form.Label>Creditos Aprobados Semestre Anterior</Form.Label>
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

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                value={correo}
                onChange={handleChange}
                autoComplete='off'
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="number"
                value={telefono}
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

            <Form.Group className="mb-3" controlId="horario">
              <Form.Label>Horario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Aqui va a ir el horario"
                value={horario}
                onChange={handleChange}
                autoComplete='off'
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="boleta">
              <Form.Label>Boleta</Form.Label>
              <Form.Control
                type="jpg"
                placeholder="Aqui va a ir la boleta"
                value={boleta}
                onChange={handleChange}
                autoComplete='off'
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="condicion">
              <Form.Label>Condicion</Form.Label>
              <Form.Control
                type="text"
                value={condicion}
                onChange={handleChange}
                autoComplete='off'
                required
                disabled
              />
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
          <Button form="form1" variant="danger" type="submit">
            Rechazar
          </Button>{" "}
          <Button form="form1" variant="success" type="submit">
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Gestion