import React from "react";
import '../style/Footer.css';


function Footer() {

    return(
        <div className="footer">
        <div className="contenedor">

            <div className="bloque">
            <div className="widget">
                <h3>ViajandoSolo</h3>
                <p>¡Gracias por visitar mi espacio en línea! Espero que disfrutes explorando 
                    mis proyectos y creaciones tanto como yo disfruto creándolos. 
                    Si tienes alguna pregunta o simplemente quieres conectarte, 
                    ¡no dudes en ponerte en contacto conmigo!</p>
            </div>
            
            


            <div className="widget">
                <h3>Informacion</h3>
                <p>Aviso Legal</p>
                <p>Política de Privacidad</p>
                <p>Politica de Cookies</p>
            </div>
            
            <div className="widget ">
                <h3>Contacto</h3>
                <p>Viajosolo@gmail.com</p>
                <div className="redes-sociales">
        <a href="#" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-instagram"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-youtube"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-tiktok"></i>
        </a>
    </div>
            </div>




        </div>
        </div>
    </div>
         )}

export default Footer;