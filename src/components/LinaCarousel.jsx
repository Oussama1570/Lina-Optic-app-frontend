import { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // 📦 Carousel default styles
import "../Styles/StylesLinaCarousel.css";

// 📷 Carousel images
import CarreraImg from "../assets/Les lunettes de Lina Optic/CARRERA/carrera.jpg";
import  CerrutiImg from "../assets/Les lunettes de Lina Optic/Cerruti/cerruti.jpg";
import GucciImg from "../assets/Les lunettes de Lina Optic/GUCCI/gucci.jpg";

const LinaCarousel = () => {
  // 🖱️ Custom cursor animation inside the carousel wrapper
  useEffect(() => {
    const cursor = document.querySelector(".custom-hover-cursor");
    const wrapper = document.querySelector(".lina-carousel-wrapper");

    // 🔄 Move the cursor based on mouse coordinates inside wrapper
    const moveCursor = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };

    // 👁️ Show cursor when mouse enters carousel
    const showCursor = () => {
      cursor.style.opacity = 1;
    };

    // 🙈 Hide cursor when mouse leaves carousel
    const hideCursor = () => {
      cursor.style.opacity = 0;
    };

    // 🧷 Attach listeners
    wrapper.addEventListener("mousemove", moveCursor);
    wrapper.addEventListener("mouseenter", showCursor);
    wrapper.addEventListener("mouseleave", hideCursor);

    // 🧹 Clean up on unmount
    return () => {
      wrapper.removeEventListener("mousemove", moveCursor);
      wrapper.removeEventListener("mouseenter", showCursor);
      wrapper.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <div className="lina-carousel-wrapper">
      {/* 🌀 Custom animated hover cursor */}
      <div className="custom-hover-cursor"></div>

      {/* 🎠 Main Carousel Component */}
      <Carousel
        autoPlay            // 🔄 Autoplay carousel
        infiniteLoop        // 🔁 Loop slides
        showThumbs={false}  // 🚫 Hide thumbnail nav
        showStatus={false}  // 🚫 Hide status text
        interval={5000}     // ⏱️ Slide interval in ms
        showArrows          // ⬅️➡️ Show navigation arrows
        swipeable           // 📱 Allow swipe gestures
        emulateTouch        // 📲 Enable mobile behavior

        // ⬅️ Custom left arrow
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button className="custom-arrow left" onClick={onClickHandler}>‹</button>
          )
        }

        // ➡️ Custom right arrow
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button className="custom-arrow right" onClick={onClickHandler}>›</button>
          )
        }
      >
        {/* 📷 Slides data */}
        {[
  {
    subtitle: "CARRERA",
    title: "Tendance Sans Cadre",
    image: CarreraImg,
  },
  {
    subtitle: "CERRUTI 1881",
    title: "Monture Fine et Élégante",
    image: CerrutiImg,
  },
  {
    subtitle: "GUCCI",
    title: "Design Classique & Luxe",
    image: GucciImg,
  },
]
.map((slide, index) => (
          <div className="carousel-slide" key={index}>
            {/* 📸 Slide image */}
            <div className="carousel-image-block">
              <img src={slide.image} alt={slide.title} className="carousel-img" />
            </div>

            {/* 📝 Overlay text and CTA */}
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
