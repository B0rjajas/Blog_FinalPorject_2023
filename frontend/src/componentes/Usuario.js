import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Usuario = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Realizar una solicitud GET al backend para obtener los detalles del usuario
    axios.get(`http://localhost:5000/api/user/${userId}`)
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del usuario:', error);
      });
  }, [userId]);

  return (
    <div>
      <h2>Detalles del Usuario</h2>
      {userData ? (
        <div>
          <p>ID: {userData.id}</p>
          <p>Nombre de Usuario: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default Usuario;
