import React from 'react'
import imagen from '../assets/logo-TEC.jpg';

const Inicio = () => {
  return (
    <>
    <div className="contenedor">
      <div className='pagImagen'>
          <img src={imagen} alt="Logo2" />
      </div>
      <div className='pagText'>
          <h4>Te damos la bienvenida al Sistema de Gestión de Asistencias del Tecnológico de Costa Rica</h4>
      </div>
    </div>
    </>
  )
}

export default Inicio