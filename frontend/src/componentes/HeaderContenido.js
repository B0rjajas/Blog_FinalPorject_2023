import React from "react";
import "../style/Headercontenido.css";
import SearchBar from "./SearchBar";

function HeaderContenido() {

  const handleSearch = (searchResults) => {
    // Aquí puedes implementar la lógica para mostrar los resultados de búsqueda
    console.log("Resultados de búsqueda:", searchResults);
  };

  return (

    
    <div className="header-contenido">
      <div className="contenedor">
      <div className="titulo ">
        <h1>Bienvenido a Blog de Viajes</h1>
        <p>Un espacio donde compartir mi experiencias y trucos</p>
        <div className="searchbar">
          <div className="centrado">
        <SearchBar onSearch={handleSearch} />
        </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default HeaderContenido;
