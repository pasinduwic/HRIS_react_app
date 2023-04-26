import { Routes, Route } from "react-router-dom";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { NavLink } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
// import Department from "./pages/Department";
// import Office from "./pages/Office";
// import Employee from "./pages/Employee";
// import EmployeeDetails from "./pages/EmployeeDetails";
// import Attendance from "./pages/Attendance";
// import Leaves from "./pages/Leaves";
// import Payrol from "./pages/Payrol";
// import Designation from "./pages/Designation";

// import CartView from "./components/CartView";

import { useSelector, useDispatch } from "react-redux";
// import { auth } from "./config/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

export default function App() {
  const StatusVar = useSelector((state: any) => state.statusVar.value);
  const sessionUser = useSelector(
    (state: any) => state.statusVar.value.sessionUser
  );
  // console.log(StatusVar);
  // const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="department" element={<Department />} /> */}
          {/* <Route path="office" element={<Office />} /> */}
          {/* <Route path="employee" element={<Employee />} /> */}
          {/* <Route path="employee/:id" element={<EmployeeDetails />} /> */}
          {/* <Route path="attendance" element={<Attendance />} /> */}
          {/* <Route path="leaves" element={<Leaves />} /> */}
          {/* <Route path="payrol" element={<Payrol />} /> */}
          {/* <Route path="designation" element={<Designation />} /> */}
        </Route>
      </Routes>
    </div>
  );
}
