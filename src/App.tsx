import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Register from "./Pages/Register";
import AuthLayout from "./AuthLayout";
import Login from "./Pages/Login";
import Layout from "./Layout";
function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
