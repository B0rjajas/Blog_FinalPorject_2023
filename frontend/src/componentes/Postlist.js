import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card3 from './Card3';
import '../style/Postlist.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Número de posts por página

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('http://localhost:5000/obtener_publicaciones');
        setPosts(response.data);
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
      }
    }

    fetchPosts();
  }, []);

  const deletePost = async (postId) => {
    try {
      // Realiza una solicitud para eliminar el post con el ID dado
      await axios.delete(`http://localhost:5000/api/eliminar_post/${postId}`);
      // Actualiza la lista de posts después de la eliminación
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    const maxPage = Math.ceil(posts.length / postsPerPage);
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="contenedor">
      <div className="listado">
        {currentPosts.map((post) => (
          <Card3
            key={post.id}
            post={post}
            onDelete={deletePost}
          />
        ))}
      </div>

      <div className="pagination-buttons">
        <div className="espacio">
          <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
          <button onClick={nextPage} disabled={currentPage === Math.ceil(posts.length / postsPerPage)}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default PostList;
