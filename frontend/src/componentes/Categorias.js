import React, { useRef } from "react";
import '../style/Categorias.css';

function Categoria() {
  const actividadesRef = useRef(null);
  const festivalesRef = useRef(null);
  const hospedajesRef = useRef(null);
  const tipsRef = useRef(null);

  return (
    <div className="categorias">
      <ul>
        <li>
        <a ref={festivalesRef}>
        <i className="fas fa-glass-cheers"></i>
        Festivales
        </a>
          
        </li>
        <li>
        <a ref={tipsRef}>
        <i className="fas fa-lightbulb"></i>
        Tips
        </a>
         
        </li>
        <li>
          <a ref={actividadesRef}>
           <i className="fas fa-music"></i>
            Actividades
           </a>
       
          
        </li>
        <li>
        <a ref={hospedajesRef}>
            <i className="fas fa-hotel"></i>
            Hospedajes
          </a>
         
        </li>
      </ul>
    </div>
    
  
   

  );
}

export default Categoria;
