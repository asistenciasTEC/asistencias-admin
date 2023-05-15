import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useNavigate();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });

    try {
      if (!email || !password) {
        setData({ ...data, error: "Todos los campos son obligatorios", loading: false });
      } else {
        try {
          if (email === "vargasdaniel195@gmail.com") {
            await signInWithEmailAndPassword(auth, email, password);
            setData({
              email: "",
              password: "",
              error: null,
              loading: false,
            });
            history("/");
          } else {
            throw new Error("El correo no tiene permisos para acceder");
          }
        } catch (error) {
          setData({ ...data, error: error.message, loading: false });
          toast.error(error.message);
        }
      }
    } catch (error) {
      setData({ ...data, error: error.message, loading: false });
    }
  };



  const restablecerContraseña = async (e) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Se envio un correo de restablecimiento de contraseña");
      })
      .catch((error) => {
        toast.error("Tiene que añadir un correo en el espacio designado");
      });
  };
  return (
    <section>
      <h3>Inicio de Sesion</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{"Los datos son inválidos o los campos se encuentran vacíos."}</p> : null}
        <div className="btn_container">
          <button className="btnIngresar" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
        <div className="btn_container">
          <button href="/" type="button" className="btn_restablecer" onClick={() => {
            restablecerContraseña();
          }}>¿Olvido su contraseña?</button >
        </div>
      </form>
      <ToastContainer />
    </section>

  );
};

export default Login;