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
    <form className="login-form" onSubmit={handleLogin}>
      <h3>Welcome Back!</h3>
      <div className="form-group">
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default Login;
