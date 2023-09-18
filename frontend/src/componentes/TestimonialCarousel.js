import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../style/TestimonialCarousel.css";
import imagen01 from "../imagenes/imagen01.jpg";
import imagen02 from "../imagenes/imagen02.jpg";
import imagen03 from "../imagenes/imagen03.jpeg";

const TestimonialCarousel = () => {
  return (
    <div className="testimonial-carousel">
      <Carousel showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop >
        <div className="testimonial-slide">
          <div className="testimonial-content">
            <img src={imagen01} alt="Testimonial 1" />
            <p className="name"> Mary J</p>
            <blockquote>
              "Un montón de tips para ganar más"
            </blockquote>

          </div>

          <div className="testimonial-content">
            <img src={imagen01} alt="Testimonial 1" />
            <p className="name"> Jessica</p>
            <blockquote>
              "Una experiencia diferente"
            </blockquote>

          </div>


          <div className="testimonial-content">
            <img src={imagen01} alt="Testimonial 1" />
            <p className="name"> Felicia</p>
            <blockquote>
              "Aqui hago mis consultas"
            </blockquote>

          </div>
        </div>
        <div className="testimonial-slide">
          <div className="testimonial-content">
            <img src={imagen02} alt="Testimonial 2" />
            <p className="name"> Wild Unknow</p>

            <blockquote>
              "Fácil de entender y poner en práctica"
            </blockquote>
          </div>
        </div>
        <div className="testimonial-slide">
          <div className="testimonial-content">
            <img src={imagen03} alt="Testimonial 3" />
            <blockquote>
            <p className="name"> Uno de España</p>

              "Gracias a este blog consegui mi objetivo"
            </blockquote>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
