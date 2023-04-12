import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth} from "../config/firebase/firebase";
import { useNavigate } from "react-router-dom";

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
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history("/");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <section>
      <h3>Inicio de Sesion</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="email">Correo electronico</label>
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
        {error ? <p className="error">{"Los datos son invalidos o los campos se encuentran vacios."}</p> : null}
        <div className="btn_container">
          <button className="btnIngresar" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;