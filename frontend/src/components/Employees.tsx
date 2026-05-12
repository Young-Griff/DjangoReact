import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Employees.css";
import type { Role } from "./EmployeeAdd";
import { EditEmployeeModal } from "./EmployeeEditModal";

export interface Employee {
  id: number;
  emp_uname: string;
  emp_fname: string;
  emp_lname: string;
  rate: number;
  role: string;
  role_started: Date;
  role_ended: Date;
}

export interface Inputs {
  id: number;
  employee: string;
  rate: number;
  role: string;
  role_started: string;
  role_ended?: string;
}

export function getEmployees(setter: (emps: Employee[]) => void) {
  const url = localStorage.getItem("apiURL") + "employees";
  const fetchData = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      setter(response.data);
    } catch (e: any) {
    }
  };
  fetchData();
}

export async function fetchRoles(setter: (roles: Role[]) => void) {
  try {
    const response = await axios.get(
      localStorage.getItem("apiURL") + "get-roles/",
    );
    setter(response.data);
  } catch (e: any) {
    console.log(e);
  }
}

/*
  TODO: add edit and delete functionalities
 */

function Employees() {
  // only allow access to logged in users
  const { isLoggedIn, csrfToken } = useAuth();
  const [edit, setEdit] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  // user must be logged in
  const curTime = Date.now()
  const sessExpiry = Number(localStorage.getItem("user")); 
  if (sessExpiry < curTime || !isLoggedIn)
    return <Navigate to="/" replace={true} />;
  
  const [emps, setEmps] = useState<Employee[]>([]);
  useEffect(() => {
    getEmployees(setEmps);
  }, []);
  useEffect(() => {
    fetchRoles(setRoles);
  }, []);

  function editEmployee(emp: Employee) {
    setEmployeeToEdit(emp);
    setEdit(true);
  }

  function closeEditModal() {
    setEdit(false);
    setEmployeeToEdit(null);
  }

  function handleEditSubmit(data: Inputs) {
    const updateEmp = async () => {
      try {
        const response = await axios.put(
          localStorage.getItem("apiURL") + "add-employee/",
          data,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            },
          },
        );
        console.log(response);
      } catch (e: any) {
        console.log(e.response);
      }
    };
    updateEmp();
    closeEditModal();
    getEmployees(setEmps);
  }

  function deleteEmployee(emp: Employee) {
    const text = `Are you sure you want to delete user ${emp.emp_uname} `;
    const text2 = `as a ${emp.role}? This action is not reversible.`;
    const confirmDelete = confirm(text + text2);
    if (confirmDelete) {
      try {
        const deleteRole = async () => {
          const url = localStorage.getItem('apiURL') + `remove-role/${emp.id}`;
          const response = axios.delete(url, {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            }},);
          console.log(response);
          let newEmps = []
          for (var i = 0; i < emps.length; i++) {
            if (emps[i].id != emp.id) newEmps.push(emps[i]); 
          } 
          setEmps(newEmps);
        }
        deleteRole();
      } catch (e: any) {
        console.log(e);
      }
    }
  }


  return (
    <>
      <h1>Current Employees</h1>
      <Link className="btn btn-primary" to="/add-role">
        Add Position
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Rate ($)</th>
            <th scope="col">Role</th>
            <th scope="col">Role Start</th>
            <th scope="col">Role End</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {emps.map((emp: Employee) => {
            return (
              <tr key={emp.emp_uname + "-" + emp.role}>
                <td>{emp.emp_uname}</td>
                <td>{emp.emp_fname}</td>
                <td>{emp.emp_lname}</td>
                <td>{emp.rate}</td>
                <td>{emp.role}</td>
                <td>{String(emp.role_started)}</td>
                <td>
                  {String(emp.role_ended) == "null"
                    ? "N/A"
                    : String(emp.role_ended)}
                </td>
                <td>
                  <button
                    onClick={() => editEmployee(emp)}
                    className="btn btn-info"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteEmployee(emp)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <EditEmployeeModal
        open={edit}
        employee={employeeToEdit}
        roles={roles}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}

export default Employees;
