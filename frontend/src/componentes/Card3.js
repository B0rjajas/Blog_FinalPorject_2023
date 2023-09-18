import React, { useState } from "react";
import "../style/Card2.css";
import { Link } from 'react-router-dom';

function Card3({ post,  }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = async () => {
    setShowDetails(!showDetails);
  };

  const maxVisibleCharacters = 50; // Número máximo de caracteres visibles

  const getShortenedMessage = () => {
    if (post.message.length <= maxVisibleCharacters) {
      return post.message;
    } else {
      return post.message.substring(0, maxVisibleCharacters) + '...';
    }
  };

  return (
    <div className="contenedor">

    
      <div className="card-container">
      
        <div className="image-container">
          {/* Enlace a la página del post */}
          <Link to={`/post/${post.id}`}>
            {post && post.image && (
              <img src={`http://localhost:5000/img/${post.image}`} alt={post.title} className="card-image" />
            )}
          </Link>
        </div>

        

        <div className="card-content">
          <div className="card-body">
            <h3>{post.title}</h3>
            <p className={showDetails ? "card-description expanded" : "card-description"}>
              {showDetails ? post.message : getShortenedMessage()}
            </p>
            
            
            <Link to={`/post/${post.id}`} className="button-vermas">
              Ver más
            </Link>
            
            
          </div>
        </div>
      </div>
      {/* Agrega el componente LastPosts debajo del contenido del post */}
      
    </div>
  );
}

export default Card3;
