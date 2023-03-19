import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Table, Modal, Form, Button } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from 'uuid';


const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [dataForm, setDataForm] = useState({
    id: "",
    year: "",
    semestre: "",
    horasAsistente: "",
    horasEspecial: "",
    horasEstudiante: "",
    horasTutoria: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");

  const {
    id,
    year,
    semestre,
    horasAsistente,
    horasEspecial,
    horasEstudiante,
    horasTutoria } = dataForm;

  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value
    })
  }

  useEffect(() => {
    const obtenerPeriodos = async () => {
      const periodosCollection = collection(db, "periodos");
      const snapshot = await getDocs(periodosCollection);
      const listaPeriodos = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setPeriodos(listaPeriodos);
    };
    obtenerPeriodos();
  }, []);

  const abrirModal = (accion, id) => {
    if (accion === "agregar") {
      console.log(id)
      setModalTitle("Agregar periodo");
      setModalAction("Agregar");
      setDataForm({
        id: "",
        year: "",
        semestre: "",
        horasAsistente: "",
        horasEspecial: "",
        horasEstudiante: "",
        horasTutoria: ""
      });

    } else if (accion === "editar") {
      console.log(id)
      const periodo = periodos.find((periodo) => periodo.id === id);
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
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const agregarPeriodo = async (e) => {
    console.log("Agrega")
    e.preventDefault();
    const nuevoPeriodo = { id: uuid(), year, semestre, horasAsistente, horasEspecial, horasEstudiante, horasTutoria };
    await addDoc(collection(db, "periodos"), nuevoPeriodo);
    setPeriodos([...periodos, nuevoPeriodo]);
    cerrarModal();
  };

  const editarPeriodo = async (e) => {
    console.log("Edita")
    e.preventDefault();
    console.log(id)
    const periodoActualizado = { year, semestre, horasAsistente, horasEspecial, horasEstudiante, horasTutoria };
    const q = query(collection(db, "periodos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, periodoActualizado)
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    });
    const listaPeriodosActualizada = periodos.map((periodo) =>
      periodo.id === id ? { id: id, ...periodoActualizado } : periodo
    );
    setPeriodos(listaPeriodosActualizada);
    cerrarModal();
  };

  const eliminarPeriodo = async (id) => {
    const q = query(collection(db, "periodos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });
    const listaPeriodosActualizada = periodos.filter((periodo) => periodo.id !== id);
    setPeriodos(listaPeriodosActualizada);
  };

  return (
    <div>
      <h1>Periodos</h1>
      <Button variant="primary" onClick={() => abrirModal("agregar")}>
        Agregar Periodo
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Año</th>
            <th>Semestre</th>
            <th>Horas Asistente</th>
            <th>Horas Especial</th>
            <th>Horas Estudiante</th>
            <th>Horas Tutoria</th>
          </tr>
        </thead>
        <tbody>
          {periodos.map((periodo) => (
            <tr key={periodo.id}>
              <td>{periodo.year}</td>
              <td>{periodo.semestre}</td>
              <td>{periodo.horasAsistente}</td>
              <td>{periodo.horasEspecial}</td>
              <td>{periodo.horasEstudiante}</td>
              <td>{periodo.horasTutoria}</td>
              <td>
                <Button variant="warning" onClick={() => abrirModal("editar", periodo.id)}>
                  Editar
                </Button>
                {" "}
                <Button variant="danger" onClick={() => eliminarPeriodo(periodo.id)}>
                  Eliminar
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
          <Form id="form1" onSubmit={id ? editarPeriodo : agregarPeriodo}>
            <Form.Group className="mb-3" controlId="year">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
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
                type="text"
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
    </div>
  );
}

export default Periodos