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
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const showCursor = () => {
      cursor.style.opacity = 1;
    };

    const hideCursor = () => {
      cursor.style.opacity = 0;
    };

    if (wrapper && cursor) {
      wrapper.addEventListener("mousemove", moveCursor);
      wrapper.addEventListener("mouseenter", showCursor);
      wrapper.addEventListener("mouseleave", hideCursor);
    }

    return () => {
      if (wrapper && cursor) {
        wrapper.removeEventListener("mousemove", moveCursor);
        wrapper.removeEventListener("mouseenter", showCursor);
        wrapper.removeEventListener("mouseleave", hideCursor);
      }
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
        showArrows={false}
        swipeable
        emulateTouch
      >
        <div className="carousel-slide new-layout">
          <div className="carousel-text-block">
            <p className="carousel-subtitle">GUSTO EYEWEAR</p>
            <h2 className="carousel-title">Lunettes avec verres solaires</h2>
            <a href="/products" className="carousel-button">Découvrir</a>
          </div>
          <div className="carousel-image-block">
            <img src={Img1} alt="Gusto Eyewear" />
          </div>
        </div>

        <div className="carousel-slide new-layout">
          <div className="carousel-text-block">
            <p className="carousel-subtitle">Lunettes Modulables</p>
            <h2 className="carousel-title">Clip-On Intelligents & Élégants</h2>
            <a href="/products" className="carousel-button">Découvrir</a>
          </div>
          <div className="carousel-image-block">
            <img src={Img2} alt="Clip On" />
          </div>
        </div>

        <div className="carousel-slide new-layout">
          <div className="carousel-text-block">
            <p className="carousel-subtitle">Collection JOW WAY</p>
            <h2 className="carousel-title">OLIVIA – Style & Douceur</h2>
            <a href="/products" className="carousel-button">Découvrir</a>
          </div>
          <div className="carousel-image-block">
            <img src={Img3} alt="JOW WAY" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default LinaCarousel;
