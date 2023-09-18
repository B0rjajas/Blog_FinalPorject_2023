import React, { useState } from "react";
import NewsletterPopup from "./NewsletterPopup";
import "../style/Newsletter.css"; // Importa los estilos CSS

const Newsletter = () => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
        <div className="frase">
            <h3>¡Descubre mas cosas y participa en un concurso!</h3>
        </div>
      <div className="box">
        
        <button className="newsletter-button" onClick={openPopup}>
          ¡Suscríbete a la Newsletter!
        </button>
      </div>
      {showPopup && <NewsletterPopup onClose={closePopup} />}
    </div>
  );
};

export default Newsletter;
