import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function ParentComponent() {
  const navigate = useNavigate();

  const handleSearch = (searchResults) => {
    // Redirige a la página de resultados de búsqueda y pasa los resultados como estado
    navigate('/search-results', { state: { searchResults } });
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {/* Resto de tu código */}
    </div>
  );
}

export default ParentComponent;
