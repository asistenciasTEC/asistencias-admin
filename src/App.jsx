import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./components/Inicio";
import Login from "./components/Login";
import Profesores from "./components/Profesores";
import Cursos from "./components/Cursos";
import Asistencias from "./components/Asistencias";
import Periodos from "./components/Periodos";
import Gestion from "./components/Gestion";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./components/NotFound";
import Usuario from './components/Usuario';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/asistencias-admin/login" element={<Login />} />
            <Route exact path="/asistencias-admin/" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/" element={<Inicio />} />
            </Route>
            <Route exact path="/asistencias-admin/profesores" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/profesores" element={<Profesores />} />
            </Route>
            <Route exact path="/asistencias-admin/periodos" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/periodos" element={<Periodos />} />
            </Route>
            <Route exact path="/asistencias-admin/asistencias" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/asistencias" element={<Asistencias />} />
            </Route>
            <Route exact path="/asistencias-admin/cursos" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/cursos" element={<Cursos />} />
            </Route>
            <Route exact path="/asistencias-admin/gestion" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/gestion" element={<Gestion />} />
            </Route>
            <Route exact path="/asistencias-admin/usuario" element={<PrivateRoute />}>
              <Route path="/asistencias-admin/usuario" element={<Usuario />} />
            </Route>
            <Route exact path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
