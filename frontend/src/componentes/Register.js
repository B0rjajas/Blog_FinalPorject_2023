import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style/Register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Agregamos el estado para el correo electrónico
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
        email, // Incluimos el valor del correo electrónico en la solicitud
      });

      console.log(response.data);

      // Redireccionar a la página de inicio de sesión después del registro exitoso
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Error al registrar, intenta nuevamente');
    }
  };

  return (
    <div className="register-container">
      <h2>Regístrate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Nuevo campo para el correo electrónico */}
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>} {/* Mostrar mensaje de error si existe */}
        <button type="submit">Registrarse</button>
      </form>
      <div className="cuenta">
        <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
};

export default Register;
