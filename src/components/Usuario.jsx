import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, signOut } from "firebase/auth";

function Usuario() {
    const history = useNavigate();
    const auth = getAuth();
    const usuarioAuthentication = auth.currentUser
    const [cambioContraseña, setCambioContraseña] = useState({
        nuevaContraseña: "",
        confirmacionContraseña: ""
    });
    const handleChangePassword = (e) => {
        e.preventDefault();
        setCambioContraseña({ ...cambioContraseña, [e.target.name]: e.target.value });
    };
    const handleSubmitRegistro = async (e) => {
        e.preventDefault();

        updatePassword(usuarioAuthentication, cambioContraseña.confirmacionContraseña).then(() => {
            signOut(auth);
            history("/login");
        })
    }

    return (
        <>
            <Form id="formRegistro" onSubmit={handleSubmitRegistro} className="formContainer">
                <Row>
                    <Col>
                        <h2>Usuario Administrador</h2>
                        <Form.Group className="mb-3" controlId="cambioContraseña">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="text"
                                value={cambioContraseña.nuevaContraseña}
                                onChange={handleChangePassword}
                                name="nuevaContraseña"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmacionContraseña">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control
                                type="text"
                                value={cambioContraseña.confirmacionContraseña}
                                onChange={handleChangePassword}
                                name="confirmacionContraseña"
                            />
                        </Form.Group>
                        <div className="btn_container2">
                            <Button variant="primary" type="Submit">
                                Modificar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
export default Usuario