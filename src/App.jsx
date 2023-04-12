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

function App() {
  return (
    <>
    <AuthProvider>
    <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route exact path="/" element={<PrivateRoute/>}> 
            <Route path="/" element={<Inicio />} />
          </Route>
          <Route exact path="/profesores" element={<PrivateRoute/>}> 
            <Route path="/profesores" element={<Profesores />} />
          </Route>
          <Route exact path="/periodos" element={<PrivateRoute/>}> 
            <Route path="/periodos" element={<Periodos />} />
          </Route>
          <Route exact path="/asistencias" element={<PrivateRoute/>}> 
            <Route path="/asistencias" element={<Asistencias />} />
          </Route>
          <Route exact path="/cursos" element={<PrivateRoute/>}> 
            <Route path="/cursos" element={<Cursos />} />
          </Route>
          <Route exact path="/gestion" element={<PrivateRoute/>}> 
            <Route path="/gestion" element={<Gestion />} />
          </Route>
          <Route exact path="*" element={<NotFound/>}/>
        </Routes>
    </Router>
    </AuthProvider>

    
    </>
  );
}

export default App;
