import { Navbar, Nav, Container } from "react-bootstrap";


function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Inicio</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/profesores">Profesores</Nav.Link>
                        <Nav.Link href="/cursos">Cursos</Nav.Link>
                        <Nav.Link href="/asistencias">Asistencias</Nav.Link>
                        <Nav.Link href="/periodos">Periodos</Nav.Link>
                        <Nav.Link href="/gestion">Gestión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
