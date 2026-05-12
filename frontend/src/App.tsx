import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
//import { BrowserRouter, Routes, Route } from 'react-router';
import "./App.css";
import Home from "./components/Home";
import Departments, { DepartmentList, Dept } from "./components/Departments";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Employees from "./components/Employees";
import AddEmployee from "./components/EmployeeAdd";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'x-csrftoken'

function App() {
  // Match API host to the page host so the session cookie from Django (localhost
  // vs 127.0.0.1) is always sent with credentialed requests.
  localStorage.setItem(
    "apiURL",
    `${window.location.protocol}//${window.location.hostname}:8000/api/`,
  );
  const DEPTS = ["finance", "chemistry", "education"];

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="departments" element={<Departments />}>
            <Route index element={<DepartmentList />} />
            {DEPTS.map((dept) => (
              <Route
                path={dept.toLowerCase()}
                element={<Dept dept={dept.toLowerCase()} />}
              />
            ))}
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
          <Route path="employees" element={<Employees />} />
          <Route path="add-role" element={<AddEmployee />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />  
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
