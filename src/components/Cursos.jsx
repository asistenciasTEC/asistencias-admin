import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Table, Modal, Form, Button, Pagination } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from "uuid";
//librería de mensajes información
import { toast, ToastContainer } from "react-toastify";
//librería de iconos boostrap para react
import { MdAddBox, MdEdit, MdDelete} from "react-icons/md";

function Cursos() {
  const [Cursos, setCursos] = useState([].sort());
  const [dataForm, setDataForm] = useState({
    id: "",
    nombre: "",
    carrera: "",
    codigo: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [show, setShow] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [cursoEliminar, setCursoEliminar] = useState("");
  const [resultados, setResultados] = useState([]);
  const [valorSeleccionado, setValorSeleccionado] = useState("");


  const [showModalEditar, setShowModalEditar] = useState(false);
  const [cursoAEditar, setCursoAEditar] = useState("");

  const { id, nombre, carrera, codigo } = dataForm;
  const handleChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    const obtenerCursos = async () => {
      const CursosCollection = collection(db, "cursos");
      const snapshot = await getDocs(CursosCollection);
      const listaCursos = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setCursos(listaCursos);
    };
    obtenerCursos();
  }, []);

  const abrirModal = (accion, id = "") => {
    if (accion === "agregar") {
      setModalTitle("Agregar curso");
      setModalAction("Agregar");
      setDataForm({
        id: "",
        nombre: "",
        carrera: "",
        codigo: "",
      });
    } else if (accion === "editar") {
      const curso = Cursos.find((curso) => curso.id === id);
      setModalTitle("Editar curso");
      setModalAction("Guardar cambios");
      setDataForm({
        id: curso.id,
        nombre: curso.nombre,
        carrera: curso.carrera,
        codigo: curso.codigo,
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };
  function buscarcurso(codigo) {
    for (let i = 0; i < Cursos.length; i++) {
      if (Cursos[i].codigo === codigo) {
        return Cursos[i];
      }
      return null;
    }
  }

  //Confirm update
  const handleUpdateClick = (e) => {
    e.preventDefault();
    setCursoAEditar(e);
    cerrarModal();
    setShowModalEditar(true);
  };

  const handleConfirmUpdate = () => {
    editarcurso(cursoAEditar);
    setShowModalEditar(false);
  };

  const agregarcurso = async (e) => {
    e.preventDefault();
    const nuevocurso = { id: uuid(), nombre, carrera, codigo };

    if (buscarcurso(codigo) === null || Cursos.length === 0) {
      await addDoc(collection(db, "cursos"), nuevocurso);
      setCursos([nuevocurso, ...Cursos]);
      toast.success("Curso agregado exitosamente.");
      cerrarModal();
    } else if (buscarcurso(codigo) !== null ) {

      toast.error("El codigo a registrar ya existe");
    }
  };

  const editarcurso = async (e) => {
    e.preventDefault();
    const cursoActualizado = { nombre, carrera, codigo };
    const q = query(collection(db, "cursos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, cursoActualizado)
        .then(() => {
          toast.success("Curso editado exitosamente.");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error.");
        });
    });
    const listaCursosActualizada = Cursos.map((curso) =>
      curso.id === id ? { id: id, ...cursoActualizado } : curso
    );
    setCursos(listaCursosActualizada);
  };

  
  const handleShow = (id) => {
    setCursoEliminar(id);
    setShow(true);
  }

  const handleConfirmar = () => {
    eliminarcurso(cursoEliminar);
    setShow(false);
  }

  const eliminarcurso = async (id) => {
    const q = query(collection(db, "cursos"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
        .then(() => {
          toast.success("curso eliminado exitosamente.");
        })
        .catch((error) => {
          toast.error("Ha ocurrido un error.");
        });
    });
    const listaCursosActualizada = Cursos.filter(
      (curso) => curso.id !== id
    );
    setCursos(listaCursosActualizada);
  };

  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages =
    resultados.length > 0
      ? Math.ceil(resultados.length / itemsPerPage)
      : Math.ceil(Cursos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems =
    resultados.length > 0
      ? resultados.slice(startIndex, endIndex)
      : Cursos.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const buscarEnLista = (terminoBusqueda) => {
    const resultadosBusq = [];
    if (
      valorSeleccionado === "default" ||
      valorSeleccionado === "nombre"  ||
      valorSeleccionado === "" 
    ) {
      for (let i = 0; i <  Cursos.length; i++) {
        if (
          Cursos[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(Cursos[i]);
        }
      }
    }
    if (valorSeleccionado === "carrera") {
      for (let i = 0; i < Cursos.length; i++) {
        if (Cursos[i].carrera === terminoBusqueda) {
          resultadosBusq.push(Cursos[i]);
        }
      }
    }
    if (valorSeleccionado === "codigo") {
      for (let i = 0; i < Cursos.length; i++) {
        if (Cursos[i].codigo === terminoBusqueda) {
          resultadosBusq.push(Cursos[i]);
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

  return (
    <div className="container-lg ">
      <h1>Cursos</h1>
      <div className="row">
        <div className="col">
          <Button
            className="px-2 py-1 mb-2 fs-5"
            variant="primary"
            onClick={() => abrirModal("agregar")}
          >
            <MdAddBox />
          </Button>
        </div>
        <div className="col">
          <div className="row">
            <div className="col">
              <Form.Select aria-label="Default select example"
                onChange={handleSelectChange}>
                <option value="default">Filtros</option>
                <option value="nombre">Por Nombre</option>
                <option value="carrera">Por Carrera</option>
                <option value="codigo">Por Codigo</option>
              </Form.Select>
            </div>
            <div className="col">
              <Form className="d-sm-flex">
                <Form.Control
                  type="search"
                  placeholder="Buscar"
                  className="me-2"
                  aria-label="Search"
                  onChange={handleBusqueda}
                />
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="table-dark table-bg-scale-50">
          <tr>
            <th>Nombre</th>
            <th>Carrera</th>
            <th>Codigo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.nombre}</td>
              <td>{curso.carrera}</td>
              <td>{curso.codigo}</td>
              <td>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="warning"
                  onClick={() => abrirModal("editar", curso.id)}
                >
                  <MdEdit />
                </Button>
                <Button
                  className="px-2 py-1 mx-1 fs-5"
                  variant="danger"
                  onClick={() => handleShow(curso.id)}
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

      <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar elemento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estas seguro de que quieres eliminar este elemento?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleConfirmar}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
      
      <Modal
        show={showModalEditar}
        onHide={() => setShowModalEditar(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar edición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres editar este curso?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalEditar(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmUpdate}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="form1" onSubmit={id ? handleUpdateClick : agregarcurso}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre del curso"
                value={nombre}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="carrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Control
                type="carrera"
                placeholder="Escribe la carrera del curso"
                value={carrera}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="codigo">
              <Form.Label>Codigo</Form.Label>
              <Form.Control
                type="codigo"
                placeholder="Escribe el codigo del curso"
                value={codigo}
                onChange={handleChange}
                required={!id}
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

export default Cursos;
