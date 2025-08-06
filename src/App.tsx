import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Register from "./Pages/Register";
import AuthLayout from "./AuthLayout";
import Login from "./Pages/Login";
import Layout from "./Layout";
import Unauthorized from "./Pages/Unauthorized";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Customers from "./Pages/Customers";
import AddCustomer from "./Pages/AddCustomer";
import CustomerDetails from "./Pages/CustomerDetails";
function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            //Customers routes
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Route>
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
