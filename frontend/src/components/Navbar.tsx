import { Link } from "react-router";
import { useNavigate } from "react-router";
import "./Navbar.css";
import type { SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  function confirmLogout(e: SyntheticEvent) {
    e.preventDefault();
    const shouldLogout = window.confirm(
      "Are you sure you want to log out of your account?",
    );
    if (shouldLogout) {
      logoutUser(e);
    }
  }
  const logoutUser = async (e: SyntheticEvent) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  const loggedInLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/employees">
          Employees
        </Link>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Admin
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link className="dropdown-item" to="/add-role">
              Add Role
            </Link>
          </li>
        </ul>
      </li>
      <form className="d-flex" role="logout" onSubmit={confirmLogout}>
        <button className="btn btn-outline-success" type="submit">
          Logout
        </button>
      </form>
    </>
  );

  const loginLink = (
    <li className="nav-item">
      <Link className="nav-link auth-link" to="/login">
        Login
      </Link>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container-fluid">
        <Link className="navbar-brand brand-link" to="/">
          <img
            className="brand-logo"
            src="images/school_logo.png"
            alt="School Logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                <strong>Home</strong>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/departments">
                Departments
              </Link>
            </li>
            {isLoggedIn ? loggedInLinks : loginLink}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
