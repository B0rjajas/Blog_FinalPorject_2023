import React, { useState, useEffect } from 'react';
import '../style/CardPostsugeridos.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostSugeridos = () => {
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/last_posts')
      .then(response => {
        setSugerencias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los posts sugeridos:', error);
      });
  }, []);

  const sugerenciasLimitadas = sugerencias.slice(0, 3);

  return (
    <div className="contenedor">
      <h3 className="titulo">Últimos Posts</h3>
      <div className="post-sugeridos-list">
        {sugerenciasLimitadas.map((post, index) => (
          <div key={index} className="card-post-sugeridos">
            <Link to={`/post/${post.id}`} className="button">
              <div className="image-container">
                <img src={`http://localhost:5000/img/${post.image}`} alt={post.title} />
              </div>
            </Link>
            <Link to={`/post/${post.id}`} className="post-title-link">
              <h4 className="post-title">{post.title}</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSugeridos;
