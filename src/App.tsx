import "./App.css";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Custom from "./components/Custom";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="px-9">
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/custom" element={<Custom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
