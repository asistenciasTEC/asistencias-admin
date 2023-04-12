import React, {useContext} from 'react'
import { auth} from '../config/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './styles.css';
import { MdLogout } from "react-icons/md";

function Header() {
    const history = useNavigate();
    const {user} = useContext(AuthContext);
    const handleSignout = async () => {
        await signOut(auth);
        history("/login");
    }
    return (
        <header className='App-header'>
            <div className='NavContainer'>
                <h2>Sistema de Gestion de Asistencias</h2>
                    <div className='Scroll'>
                        {user ? (
                        <>
                        <Link to="/">Inicio</Link>
                        <Link to="/profesores">Profesores</Link>
                        <Link to="/cursos">Cursos</Link>
                        <Link to="/asistencias">Asistencias</Link>
                        <Link to="/periodos">Periodos</Link>
                        <Link to="/gestion">Gestión</Link>
                        <button className='btnLogout' onClick={handleSignout}>
                            <MdLogout/>
                        </button>
                        </>
                        ):(
                            <>
                            </>
                        )}
                    </div>
            </div>
    </header>
    );
}

export default Header;
