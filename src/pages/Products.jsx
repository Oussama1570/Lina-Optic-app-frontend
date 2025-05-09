import React, { useState, useMemo } from "react";
import ProductCard from "./products/ProductCard";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi";
import "../Styles/StylesProducts.css"; // Optional: if separated from OurSellers styles

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

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedFrameType, setSelectedFrameType] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // 👈 Load more state
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: products = [] } = useGetAllProductsQuery();

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, [products]);

  // 🧪 Apply filters
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
  if (selectedIndex !== "") {
    filteredProducts = filteredProducts.filter((p) => p.indice === selectedIndex);
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount); // 👈 Slice visible products

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 800); // Delay for smooth effect
  };
  


  return (
    <div className="our-sellers">
      <h2 className="our-sellers-title">Nos Produits</h2>
  
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
  
        <select
        value={selectedIndex}
        onChange={(e) => setSelectedIndex(e.target.value)}
        >
       <option value="">Indice</option>
       <option value="1.5">1.5</option>
       <option value="1.56">1.56</option>
       <option value="1.59">1.59</option>
       <option value="1.6">1.6</option>
       <option value="1.67">1.67</option>
       <option value="1.74">1.74</option>
       </select>

      </div>
  
      <div className="products-grid">
      {visibleProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>

      

{visibleCount < filteredProducts.length && (
  <div className="load-more-wrapper">
    {isLoadingMore ? (
      <div className="loader-spinner"></div>
    ) : (
      <button onClick={handleLoadMore} className="load-more-btn">
        Charger plus
      </button>
    )}
  </div>
)}

    </div>
  );
  
};

export default Products;