import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../style/EditarPublicacion.css";

function EditarPublicacion() {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: "",
    message: "",
    // Otros campos de la publicación, si los tienes
  });
  const navigate = useNavigate();

  // Carga la información de la publicación a editar usando postId
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/obtener_publicacion/${postId}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del post:", error);
      });
  }, [postId]);

  // Función para manejar cambios en los campos del formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Envía los cambios al servidor
      await axios.put(`http://localhost:5000/api/editar_publicacion/${postId}`, post);

      // Después de guardar con éxito, redirige al usuario a la página de detalles de la publicación
      
      navigate("/"); // Utilizamos navigate para redirigir
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  return (
    <div className="contenedor">
    
    <div className="editar"> 
        <h2>Editar Publicación</h2>
        </div>
      <form>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            value={post.message}
            onChange={handleInputChange}
          />
        </div>
        {/* Otros campos del formulario de edición, si los tienes */}
        <button type="button" onClick={handleSaveChanges}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarPublicacion;
