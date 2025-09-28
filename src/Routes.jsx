import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./pages/Signin";
import Verify from "./pages/Verify";
import UserSignup from "./pages/users/UserSignup";
import ClinicSignup from "./pages/clinics/ClinicSignup";

import DoctorDashboard from "./pages/clinics/doctordashbord";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/users/signup",
    element: <UserSignup />,
  },
  {
    path: "/users/UserSignup",
    element: <UserSignup />,
  },
  {
    path: "/clinics/signup",
    element: <ClinicSignup />,
  },
  {
    path: "/clinics/doctordashbord",
    element: <DoctorDashboard />,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
