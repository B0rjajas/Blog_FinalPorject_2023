import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../style/Postform.css';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/entrada', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      // Limpiar el formulario después de guardar la publicación
      setTitle('');
      setMessage('');
      setImage(null);
      navigate("/");
    } catch (error) {
      console.error('Error al guardar la publicación:', error);
    }
  };

  return (
    <div className='separacion'>
      <h2>Crear nueva publicación</h2>
      <form onSubmit={handleSubmit} className='post-form-container'>
        <div className='form-field'>
          <label>Título:</label>
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className='form-field'>
          <label>Mensaje:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <div className='form-field'>
          <label>Imagen:</label>
          <input
            type='file'
            onChange={(e) => setImage(e.target.files[0])}
            accept='image/*'
            required
          />
        </div>
        <button type='submit'>Guardar publicación</button>
      </form>
    </div>
  );
};

export default PostForm;
