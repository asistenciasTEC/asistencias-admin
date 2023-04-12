import React from 'react'
import imagen from '../assets/logo-TEC.jpg';

const Inicio = () => {
  return (
    <>
    <div className='pagImagen'>
        <img src={imagen} alt="Logo2" />
        <h4>Te damos la bienvenida al Sistema de Gestion de Asistencias del Tecnologico de Costa Rica</h4>
        
    </div>
    </>
  )
}

export default Inicio