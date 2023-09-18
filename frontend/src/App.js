import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Home from "./componentes/Home";
import Navbar from './componentes/Navbar';
import Login from './componentes/Login';
import Register from './componentes/Register';
import PostForm from './componentes/Postform';
import Card3 from './componentes/Card3';
import PostDetailPage from './componentes/PostDetailPage';
import Footer from './componentes/Footer';
import axios from 'axios'; // Importa Axios
import ParentComponent from './componentes/ParentComponent';
import SearchResultsPage from './componentes/SearchResultsPage';
import PostSugeridos from './componentes/PostSugeridos';
import EditarPublicacion from './componentes/EditarPublicacion';


function App() {
  const [loggedInUsername, setLoggedInUsername] = useState("");

  const handleLogout = () => {
    setLoggedInUsername("");
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/obtener_publicaciones')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los posts:', error);
      });
  }, []);

  
    const postsSugeridos = [
      { titulo: 'Post 1', link: '/post29' },
      { titulo: 'Post 2', link: '/post29' },
      { titulo: 'Post 3', link: '/post29' },
     
    ];


  return (
    <Router>
      <div>
        <Navbar loggedInUsername={loggedInUsername} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setLoggedInUsername={setLoggedInUsername} />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/post" element={<PostForm />} />
          <Route path="/obtener_publicacion/:id" element={<Card3 />} />

          <Route
            path="/post/:post_id"
            element={<><PostDetailPage /><PostSugeridos sugerencias={postsSugeridos} /></>} />          
          <Route path="/editar_publicacion/:postId" element={<EditarPublicacion />} />

          <Route path="/parent" element={<ParentComponent />} />
          <Route path="/search-results" element={<SearchResultsPage />} />


        </Routes>

        

        <Footer />
      </div>
    </Router>
  );
}

export default App;
