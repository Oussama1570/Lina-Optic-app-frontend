import React, { useState, useMemo } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../products/ProductCard";
import { useGetAllProductsQuery } from "../../redux/features/products/productsApi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../Styles/StylesOurSellers.css";

const frameTypeOptions = [
  "Plein cadre",
  "Demi-cadre (semi-cerclé)",
  "Sans cadre (invisible)",
  "Cadre en plastique",
  "Cadre en métal",
  "Cadre rond",
  "Cadre carré",
  "Cadre rectangulaire",
  "Cadre papillon",
  "Cadre aviateur",
  "Cadre ovale",
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 3 },
  desktop: { breakpoint: { max: 1400, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow left" onClick={onClick}>
    <FiChevronLeft size={20} />
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button className="custom-arrow right" onClick={onClick}>
    <FiChevronRight size={20} />
  </button>
);

const OurSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFrameType, setSelectedFrameType] = useState("");

  const { data: products = [] } = useGetAllProductsQuery();

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, [products]);

  // ✅ Apply filters
  let filteredProducts = selectedCategory === ""
    ? products
    : products.filter((p) => p.mainCategory === selectedCategory);

  if (selectedSubCategory !== "") {
    filteredProducts = filteredProducts.filter((p) => p.subCategory === selectedSubCategory);
  }

  if (selectedBrand !== "") {
    filteredProducts = filteredProducts.filter((p) => p.brand === selectedBrand);
  }

  if (selectedFrameType !== "") {
    filteredProducts = filteredProducts.filter((p) => p.frameType === selectedFrameType);
  }

  return (
    <div className="our-sellers">
      <h2 className="our-sellers-title">Notre Collection</h2>

      <div
        className="filters-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Catégorie</option>
          <option value="Hommes">Hommes</option>
          <option value="Femmes">Femmes</option>
          <option value="Enfants">Enfants</option>
        </select>

        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
        >
          <option value="">Sous-catégorie</option>
          <option value="Optique">Lunettes de vue</option>
          <option value="Solaire">Lunettes de soleil</option>
          <option value="Lentilles">Lentilles de contact</option>
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Marque</option>
          {uniqueBrands.map((brand, idx) => (
            <option key={idx} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={selectedFrameType}
          onChange={(e) => setSelectedFrameType(e.target.value)}
        >
          <option value="">Type de Cadre</option>
          {frameTypeOptions.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="carousel-wrapper">
        <Carousel
          responsive={responsive}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          itemClass="carousel-item-padding"
          containerClass="carousel-container"
        >
          {filteredProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default OurSellers;
