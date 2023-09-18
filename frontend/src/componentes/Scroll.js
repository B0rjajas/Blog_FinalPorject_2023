import React from "react";
import "../style/Scroll.css"; // Asegúrate de tener el archivo CSS para estilos personalizados

function Scroll() {
  return (
    
      <div className="scroll contenedor">
      
        <div className="scroll-entry">
          <h2>Título de la entrada 1</h2>
          <p>Contenido de la entrada 1...</p>
        </div>
        <div className="scroll-entry">
          <h2>Título de la entrada 2</h2>
          <p>Contenido de la entrada 2...</p>
        </div>
        
      </div>
    
  );
}

export default Scroll;
