import React from "react";
import Header from "./Header";
import Headercontenido from "./HeaderContenido";

import Categorias from "./Categorias";
import Subheader01 from "./Subheader01";
import PostList from "./Postlist";
import Newsletter from "./Newsletter";

import TestimonialCarousel from "./TestimonialCarousel";

function Home() {
  // Ejemplo de un array de posts (debes reemplazarlo con tu propio array)
  const posts = [
    { id: 1, title: "Título 1", message: "Contenido del post 1" },
    { id: 2, title: "Título 2", message: "Contenido del post 2" },
    // ...
  ];

  // Ejemplo de una función para eliminar un post (debes implementar la lógica)
  const handleDeletePost = (postId) => {
    // Lógica para eliminar el post
  };

  return (
    <div>
      <Header />
      <Headercontenido />
      <PostList posts={posts} onDelete={handleDeletePost} />
      <Subheader01 />
      <Categorias />
      <TestimonialCarousel />
      <Newsletter/>
    </div>
  );
}

export default Home;
