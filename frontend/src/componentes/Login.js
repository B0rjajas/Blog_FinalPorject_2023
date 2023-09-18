import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./Googleboton";
import "../style/Login.css";
import axios from "axios";



function Login(props) { // Agrega 'props' como parámetro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      // Tu lógica de inicio de sesión aquí, por ejemplo, usando axios
      console.log("Iniciando sesión con nombre de usuario:", username);

      // Después de un inicio de sesión exitoso, actualiza el estado en el componente padre
      props.setLoggedInUsername(username);

      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Log in
        </button>
      </form>
      <GoogleAuth />
      <div className="link">
        <p>¿Todavía no estás registrado? <Link to="/registro">Regístrate aquí</Link></p>
      </div>
    </div>
  );
}

export default Login;
