import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../style/PostDetailPage.css";

function PostDetailPage() {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/obtener_publicacion/${post_id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del post:", error);
      });
  }, [post_id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/eliminar_post/${post_id}`);
      // Después de eliminar el post, puedes redirigir al usuario a una página de inicio o a la lista de publicaciones
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  const handleShare = () => {
    // Aquí puedes implementar la lógica para compartir en redes sociales, como WhatsApp o Facebook.
    // Por ejemplo, puedes abrir una ventana emergente con el enlace al post para compartirlo.
    if (post) {
      const shareURL = `http://localhost:5000/post/${post.id}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(shareURL)}`, "_blank");
      // Esto abrirá WhatsApp con un mensaje que contiene el enlace al post.
    }
  };

  const handleEdit = () => {
    // Agrega lógica para redirigir al usuario a la página de edición de la publicación
    // Puedes usar 'history.push()' para hacerlo
    // Por ejemplo:
    navigate(`/editar_publicacion/${post_id}`);
  };

  if (!post) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="contenedor">
      <div className="espacio">
        <img src={`http://localhost:5000/img/${post.image}`} alt={post.title} />
      </div>
      <h2>{post.title}</h2>
      <div className="parrafo">
        <p className="cajatexto">{post.message}</p>
      </div>
      <div className="btn-share">
        <button className="btn1" onClick={handleDelete}>
          Eliminar
        </button>{" "}
        {/* Botón para eliminar el post */}
        <button className="btn2" onClick={handleShare}>
          Compartir
        </button>{" "}
        {/* Botón para compartir en redes sociales */}
        <Link to={`/editar_publicacion/${post_id}`} className="btn3" onClick={handleEdit}>
          Editar
        </Link>{" "}
        {/* Botón para editar la publicación */}
      </div>
    </div>
  );
}

export default PostDetailPage;

// http://localhost:5000/api/editar_publicacion/${postId}