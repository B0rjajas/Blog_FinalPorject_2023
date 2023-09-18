import React from "react";
import { useLocation } from "react-router-dom";
import "../style/SearchResults.css";

function SearchResultsPage() {
  const location = useLocation();
  const searchResults = location.state;

  if (!searchResults || searchResults.length === 0) {
    return <div>No hay resultados de búsqueda disponibles.</div>;
  }

  const result = searchResults[0]; // Solo se espera un resultado

  return (
    <div className="contenedor">
      <h2 className="titulo">Detalles del Blog</h2>
      <div className="espacio">
      <img src={`http://localhost:5000/img/${result.image}`} alt={result.title} />
      </div>
      <h3 className="detalle">{result.title}</h3>
      <p className="parrafo">{result.message}</p>
      
    </div>
  );
}

export default SearchResultsPage;
