import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Table, Modal, Form, Button } from "react-bootstrap";
import { db } from "../config/firebase/firebase";
import { v4 as uuid } from 'uuid';

function Profesores() {
    const [profesores, setProfesores] = useState([]);
    const [dataForm, setDataForm] = useState({
        id: "",
        nombre: "",
        email: "",
        password: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalAction, setModalAction] = useState("");

    const {
        id,
        nombre,
        email,
        password } = dataForm;

    const handleChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.id]: e.target.value
        })
    }

    useEffect(() => {
        const obtenerProfesores = async () => {
            const profesoresCollection = collection(db, "profesores");
            const snapshot = await getDocs(profesoresCollection);
            const listaProfesores = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setProfesores(listaProfesores);
        };
        obtenerProfesores();
    }, []);

    const abrirModal = (accion, id = "") => {
        if (accion === "agregar") {
            setModalTitle("Agregar profesor");
            setModalAction("Agregar");
            setDataForm({
                id: "",
                nombre: "",
                email: "",
                password: ""
            });
        } else if (accion === "editar") {
            const profesor = profesores.find((profesor) => profesor.id === id);
            setModalTitle("Editar profesor");
            setModalAction("Guardar cambios");
            setDataForm({
                id: profesor.id,
                nombre: profesor.nombre,
                email: profesor.email,
                password: profesor.password
            });
        }
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const agregarProfesor = async (e) => {
        e.preventDefault();
        const nuevoProfesor = { id: uuid(), nombre, email, password };
        await addDoc(collection(db, "profesores"), nuevoProfesor);
        setProfesores([...profesores, nuevoProfesor]);
        cerrarModal();
    };

    const editarProfesor = async (e) => {
        e.preventDefault();
        const profesorActualizado = { nombre, email, password };
        const q = query(collection(db, "profesores"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, profesorActualizado)
                .then(() => {
                    console.log("Document successfully updated!");
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        });
        const listaProfesoresActualizada = profesores.map((profesor) =>
            profesor.id === id ? { id: id, ...profesorActualizado } : profesor
        );
        setProfesores(listaProfesoresActualizada);
        cerrarModal();
    };

    const eliminarProfesor = async (id) => {
        const q = query(collection(db, "profesores"), where("id", "==", id));
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
        const listaProfesoresActualizada = profesores.filter((profesor) => profesor.id !== id);
        setProfesores(listaProfesoresActualizada);
    };

    return (
        <div>
            <h1>Profesores</h1>
            <Button variant="primary" onClick={() => abrirModal("agregar")}>
                Agregar Profesor
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre completo</th>
                        <th>E-mail</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {profesores.map((profesor) => (
                        <tr key={profesor.id}>
                            <td>{profesor.nombre}</td>
                            <td>{profesor.email}</td>
                            <td>
                                <Button variant="warning" onClick={() => abrirModal("editar", profesor.id)}>
                                    Editar
                                </Button>{" "}
                                <Button variant="danger" onClick={() => eliminarProfesor(profesor.id)}>
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
                    <Form id="form1" onSubmit={id ? editarProfesor : agregarProfesor}>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el nombre completo del profesor"
                                value={nombre}
                                onChange={handleChange}
                                autoComplete='off'
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Escribe el e-mail del profesor"
                                value={email}
                                onChange={handleChange}
                                autoComplete='off'
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Escribe la contraseña del profesor"
                                value={password}
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
        </div>
    );
}

export default Profesores