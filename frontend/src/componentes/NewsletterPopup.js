import React, { useState } from "react";
import "../style/NewsletterPopup.css"; // Importa el archivo de estilos CSS si es necesario
import imagen01 from '../imagenes/Logotipo_viajandoblanco.png';
import axios from "axios";



const NewsletterPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Crear un objeto con los datos del formulario
      const formData = {
        email: email,
        name: name,
      };
  
      // Realizar la solicitud POST al backend utilizando Axios
      const response = await axios.post('http://localhost:5000/api/suscribir', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Verificar la respuesta del servidor
      if (response.status === 200) {
        // Si la suscripción se realizó con éxito, puedes mostrar un mensaje de éxito
        console.log('Suscripción exitosa');
      } else {
        // En caso de error en el servidor, mostrar un mensaje de error
        console.error('Error al suscribirse');
      }
  
      // Cierra el pop-up después de enviar
      onClose();
    } catch (error) {
      // Capturar y manejar errores de conexión o excepciones
      console.error('Error de conexión', error);
    }
  };

  return (
    <div className="popup-overlay">
        <div className="logotipo">
        <img src={imagen01} alt="Logotipo de Viajando Solo" />
        </div>
      <div className="popup">
        <h2>¡Suscríbete a nuestra Newsletter!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default NewsletterPopup;
