import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import "./Login.css";
import type { SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login, getCSRF } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiURL = localStorage.getItem("apiURL");

  useEffect(() => {
    if (!apiURL) return;
    void getCSRF();
  }, [apiURL, getCSRF]);

  if (user) return <Navigate to="/" replace={true} />;

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const token = await getCSRF();
      await axios.post(
        `${apiURL}login/`,
        { username, password },
        {
          withCredentials: true,
          headers: token ? { "X-CSRFToken": token } : {},
        },
      );
      login(username);
      await getCSRF();
      navigate("/");
    } catch (e: unknown) {
      console.log("Login failed");
      console.log(e);
    }
  };

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleLogin} aria-labelledby="login-title">
        <header className="login-header">
          <p className="login-eyebrow">School portal</p>
          <h1 id="login-title" className="login-title">
            Welcome back
          </h1>
          <p className="login-lead">Sign in with your school account to continue.</p>
        </header>

        <div className="login-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary login-submit">
          Sign in
        </button>
      </form>
    </main>
  );
}

export default Login;
