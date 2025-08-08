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
import Items from "./Pages/Items";
import AddCustomer from "./Pages/AddCustomer";
import CustomerDetails from "./Pages/CustomerDetails";
import EditCustomer from "./Pages/EditCustomer";
import AddItems from "./Pages/AddItems";
import Services from "./Pages/Services";
import AddServices from "./Pages/AddServices";
import ServiceDetails from "./Pages/ServiceDetails";
import EditService from "./Pages/EditServices";
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
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/add" element={<AddItems />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/add" element={<AddServices />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/services/edit/:id" element={<EditService />} />
          </Route>
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
