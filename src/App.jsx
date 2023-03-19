import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./components/Inicio";
import Header from "./components/Header";
import Profesores from "./components/Profesores";
import Cursos from "./components/Cursos";
import Asistencias from "./components/Asistencias";
import Periodos from "./components/Periodos";
import Gestion from "./components/Gestion";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/profesores" element={<Profesores />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/asistencias" element={<Asistencias />} />
          <Route path="/periodos" element={<Periodos />} />
          <Route path="/gestion" element={<Gestion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
