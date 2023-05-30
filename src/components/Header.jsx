import React, { useContext } from 'react'
import { auth } from '../config/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './styles.css';
import { MdLogout, MdManageAccounts } from "react-icons/md";

function Header() {
    const history = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/asistencias-admin/login");
    }

    const handleRoute = () => {
        history('/asistencias-admin/usuario');
    };
    return (
        <header className='App-header'>
            <div className='NavContainer'>
                <h2>Sistema de Gestión de Asistencias</h2>
                <div className='Scroll'>
                    {user ? (
                        <>
                            <Link to="/asistencias-admin/">Inicio</Link>
                            <Link to="/asistencias-admin/profesores">Profesores</Link>
                            <Link to="/asistencias-admin/cursos">Cursos</Link>
                            <Link to="/asistencias-admin/asistencias">Asistencias</Link>
                            <Link to="/asistencias-admin/periodos">Periodos</Link>
                            <Link to="/asistencias-admin/gestion">Gestión</Link>
                            <MdManageAccounts type="button" className="btnLogin" onClick={handleRoute} />
                            <button type="button" className='btnLogout' onClick={handleSignout}>
                                <MdLogout />
                            </button>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
