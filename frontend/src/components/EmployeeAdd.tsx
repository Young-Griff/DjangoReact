import {
  useEffect,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
} from "react";
import { Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import "./EmployeeAdd.css";
import { useAuth } from "../context/AuthContext";
import { fetchRoles } from "./Employees";

export interface Role {
  title: string;
  role: string;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
}

interface Inputs {
  employee: string;
  rate: number;
  role: string;
  role_started: string;
  role_ended?: string;
}

export function getUsers(setter: (emps: User[]) => void) {
  const url = localStorage.getItem("apiURL") + "users";
  const fetchData = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true });
      console.log(response);
      setter(response.data);
    } catch (e: any) {
      console.log(e.response);
    }
  };
  fetchData();
}

function AddEmployee() {
  const { csrfToken, isLoggedIn } = useAuth();
  // user must be logged in
  const curTime = Date.now()
  const sessExpiry = Number(localStorage.getItem("user")); 
  if (sessExpiry < curTime || !isLoggedIn)
    return <Navigate to="/" replace={true} />;
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    fetchRoles(setRoles);
  }, []);
  useEffect(() => {
    getUsers(setUsers);
  }, []);
  const apiURL = localStorage.getItem("apiURL");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(apiURL + "add-employee/", data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
      console.log(response);
      navigate("/employees");
    } catch (e: any) {
      console.log(e.response);
    }
  };

  // adjust size of select when it is focused on
  function adjustSize(e: any) {
    if (selected) setSelected(false);
    else setSelected(true);
    console.log(selected);
  }

  return (
    <div className="employee-add">
      <div className="employee-add__card">
        <header className="employee-add__header">
          <h1 className="employee-add__title">Add employee role</h1>
          <p className="employee-add__subtitle">
            Enter role information below. Fields marked with * are required.
          </p>
        </header>

        <form
          className="employee-add__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="employee-add__field">
            <label className="employee-add__label" htmlFor="employee">
              Employee ID <span className="employee-add__required">*</span>
            </label>
            <select
              id="employee"
              className="employee-add__select"
              defaultValue=""
              {...register("employee", { required: "Employee ID is required" })}
            >
              <option value="" disabled>
                Select an employee...
              </option>
              {users.map((usr: User) => (
                <option value={usr.username} key={usr.username}>
                  {usr.first_name} {usr.last_name} ({usr.username})
                </option>
              ))}
            </select>
            {errors.employee && (
              <span className="employee-add__error">
                {errors.employee.message}
              </span>
            )}
          </div>

          <div className="employee-add__field">
            <label className="employee-add__label" htmlFor="rate">
              Hourly rate ($) <span className="employee-add__required">*</span>
            </label>
            <input
              id="rate"
              className="employee-add__input"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              autoComplete="off"
              {...register("rate", {
                required: "Hourly rate is required",
                valueAsNumber: true,
                min: { value: 0, message: "Rate must be zero or greater" },
              })}
            />
            {errors.rate && (
              <span className="employee-add__error">{errors.rate.message}</span>
            )}
          </div>

          <div className="employee-add__field">
            <label className="employee-add__label" htmlFor="role">
              Role <span className="employee-add__required">*</span>
            </label>
            <select
              id="role"
              className="employee-add__select"
              defaultValue=""
              {...register("role", { required: "Please select a role" })}
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles.map((role) => (
                <option value={role.title} key={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="employee-add__error">{errors.role.message}</span>
            )}
          </div>

          <div className="employee-add__row">
            <div className="employee-add__field">
              <label className="employee-add__label" htmlFor="role_started">
                Role start date{" "}
                <span className="employee-add__required">*</span>
              </label>
              <input
                id="role_started"
                className="employee-add__input"
                type="date"
                {...register("role_started", {
                  required: "Start date is required",
                })}
              />
              {errors.role_started && (
                <span className="employee-add__error">
                  {errors.role_started.message}
                </span>
              )}
            </div>

            <div className="employee-add__field">
              <label className="employee-add__label" htmlFor="role_ended">
                Role end date
              </label>
              <input
                id="role_ended"
                autoComplete="off"
                className="employee-add__input"
                type="date"
                {...register("role_ended")}
              />
              <span className="employee-add__hint">
                Optional — leave blank if ongoing
              </span>
            </div>
          </div>

          <div className="employee-add__actions">
            <button type="submit" className="employee-add__submit">
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
