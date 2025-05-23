import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../Styles/StylesLinaCarousel.css";

import Img1 from "../assets/Lunettes de carousel/Lunettes pour hommes Carousel.jpg";
import Img2 from "../assets/Lunettes de carousel/Lunettes optiques pour femmes Carousel.jpg";
import Img3 from "../assets/Lunettes de carousel/Lunettes divers cadres.jpg";

const LinaCarousel = () => {
 useEffect(() => {
  const cursor = document.querySelector(".custom-hover-cursor");
  const wrapper = document.querySelector(".lina-carousel-wrapper");

  const moveCursor = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  const showCursor = () => {
    cursor.style.opacity = 1;
  };

  const hideCursor = () => {
    cursor.style.opacity = 0;
  };

  wrapper.addEventListener("mousemove", moveCursor);
  wrapper.addEventListener("mouseenter", showCursor);
  wrapper.addEventListener("mouseleave", hideCursor);

  return () => {
    wrapper.removeEventListener("mousemove", moveCursor);
    wrapper.removeEventListener("mouseenter", showCursor);
    wrapper.removeEventListener("mouseleave", hideCursor);
  };
}, []);



  return (
    <div className="lina-carousel-wrapper">
      <div className="custom-hover-cursor"></div>

      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        showArrows
        swipeable
        emulateTouch
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button className="custom-arrow left" onClick={onClickHandler}>‹</button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button className="custom-arrow right" onClick={onClickHandler}>›</button>
          )
        }
      >
        {[{
          subtitle: "GUSTO EYEWEAR",
          title: "Lunettes avec verres solaires",
          image: Img1,
        }, {
          subtitle: "Lunettes Modulables",
          title: "Clip-On Intelligents & Élégants",
          image: Img2,
        }, {
          subtitle: "Collection JOW WAY",
          title: "OLIVIA – Style & Douceur",
          image: Img3,
        }].map((slide, index) => (
          <div className="carousel-slide" key={index}>
            <div className="carousel-image-block">
              <img src={slide.image} alt={slide.title} className="carousel-img" />
            </div>
            <div className="carousel-overlay">
              <p className="carousel-subtitle">{slide.subtitle}</p>
              <h2 className="carousel-title">{slide.title}</h2>
              <a href="/products" className="carousel-button">
                Découvrir
              </a>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LinaCarousel;
