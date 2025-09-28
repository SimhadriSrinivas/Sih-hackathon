import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Verify from "./pages/Verify";
import UserSignup from "./pages/users/UserSignup";
import ClinicSignup from "./pages/clinics/ClinicSignup";
import Doctordashbord from "./pages/clinics/doctordashbord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/users/signup" element={<UserSignup />} />
        <Route path="/clinics/signup" element={<ClinicSignup />} />
        <Route path="/users/UserSignup.jsx" element={<UserSignup />} />
        <Route path="/clinics/ClinicSignup.jsx" element={<ClinicSignup />} />
        <Route path="/clinics/doctordashbord" element={<Doctordashbord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;