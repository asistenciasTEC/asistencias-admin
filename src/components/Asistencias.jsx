import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Table, Modal, Form, Button} from "react-bootstrap";
import { db } from "../config/firebase/firebase";
//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";
//librería de iconos boostrap para react
import {MdEdit} from "react-icons/md";

function Asistencias() {
  const [asistencias, setAsistencias] = useState([].sort());
  const [dataForm, setDataForm] = useState({
    id: "",
    tipoAsistencia: "",
    promedioPonderado: "",
    notaCurso: "",
    semestresActivos: "",
    creditosAprobados: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");

  const { id, tipoAsistencia, promedioPonderado, notaCurso, semestresActivos, creditosAprobados } = dataForm;
  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    const obtenerAsistencias = async () => {
      const asistenciasCollection = collection(db, "asistencias");
      const snapshot = await getDocs(asistenciasCollection);
      const listaAsistencias = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAsistencias(listaAsistencias);
    };
    obtenerAsistencias();
  }, []);

  const abrirModal = (accion, id = "") => {
      const asistencia = asistencias.find((asistencia) => asistencia.id === id);
      setModalTitle("Editar requisitos");
      setModalAction("Guardar cambios");
      setDataForm({
        id: asistencia.id,
        tipoAsistencia: asistencia.tipoAsistencia,
        promedioPonderado: asistencia.promedioPonderado,
        notaCurso: asistencia.notaCurso,
        semestresActivos: asistencia.semestresActivos,
        creditosAprobados: asistencia.creditosAprobados,
      });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const editarAsistencia = async (e) => {
    e.preventDefault();
    const asistenciaActualizado = { tipoAsistencia, promedioPonderado, notaCurso, semestresActivos, creditosAprobados };
    const q = query(collection(db, "asistencias"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, asistenciaActualizado)
        .then(() => {
          toast.success("Requerimientos de asistencia editados exitosamente.");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error.");
        });
    });
    const listaAsistenciasActualizada = asistencias.map((asistencia) =>
      asistencia.id === id ? { id: id, ...asistenciaActualizado } : asistencia
    );
    setAsistencias(listaAsistenciasActualizada);
    cerrarModal();
  };

  return (
    <div className="container-lg ">
      <h1>Asistencias</h1>
      <Table striped bordered hover>
        <thead className="table-dark table-bg-scale-50">
          <tr>
            <th>Tipo de asistencia</th>
            <th>Promedio Ponderado</th>
            <th>Nota Curso Aprobado</th>
            <th>Semestres Activos</th>
            <th>Creditos Aprobados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => (
            <tr key={asistencia.id}>
              <td>{asistencia.tipoAsistencia}</td>
              <td>{asistencia.promedioPonderado}</td>
              <td>{asistencia.notaCurso}</td>
              <td>{asistencia.semestresActivos}</td>
              <td>{asistencia.creditosAprobados}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="warning"
                  onClick={() => abrirModal("editar", asistencia.id)}
                >
                  <MdEdit/>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>


      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1" onSubmit={editarAsistencia}>
            
            <Form.Group className="mb-3" controlId="tipoAsistencia">
              <Form.Label>Tipo de asistencia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre del tipo de asistencia"
                value={tipoAsistencia}
                onChange={handleChange}
                autoComplete="off"
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="promedioPonderado">
              <Form.Label>Promedio Ponderado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe tu Promedio Ponderado "
                value={promedioPonderado}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="notaCurso">
              <Form.Label>Nota Curso Aprobado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe la Nota del Curso Aprobado"
                value={notaCurso}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="semestresActivos">
              <Form.Label>Semestres Activos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe los semestres activos que llevas"
                value={semestresActivos}
                onChange={handleChange}
                required={!id}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="creditosAprobados">
              <Form.Label>Creditos Aprobados</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe los creditos aprobados que llevas"
                value={creditosAprobados}
                onChange={handleChange}
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

export default Asistencias;
