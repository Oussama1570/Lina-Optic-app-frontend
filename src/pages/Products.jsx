import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./products/ProductCard";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi";
import "../Styles/StylesProducts.css";
import SelectorsPageProducts from './../components/SelectorProductsPage';  // adjust path if needed


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
  const [selectedCategory, setSelectedCategory] = useState(["All"]);
const [selectedSubCategory, setSelectedSubCategory] = useState(["All"]);
const [selectedBrand, setSelectedBrand] = useState(["All"]);
const [selectedFrameType, setSelectedFrameType] = useState(["All"]);
const [selectedIndex, setSelectedIndex] = useState(["All"]);

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
  data: products = [],
  isLoading,
  isFetching,
  isError,
} = useGetAllProductsQuery();


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const subCategoryFromUrl = queryParams.get("subCategory");


  useEffect(() => {
  if (categoryFromUrl) {
    setSelectedCategory([categoryFromUrl]);
  }
  if (subCategoryFromUrl) {
    setSelectedSubCategory([subCategoryFromUrl]);
  }
}, [categoryFromUrl, subCategoryFromUrl]);

    

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, [products]);

  let filteredProducts = products;

if (selectedCategory.length && !selectedCategory.includes("All")) {
  filteredProducts = filteredProducts.filter((p) =>
    selectedCategory.includes(p.mainCategory)
  );
}

if (selectedSubCategory.length && !selectedSubCategory.includes("All")) {
  filteredProducts = filteredProducts.filter((p) =>
    selectedSubCategory.includes(p.subCategory)
  );
}

if (selectedBrand.length && !selectedBrand.includes("All")) {
  filteredProducts = filteredProducts.filter((p) =>
    selectedBrand.includes(p.brand)
  );
}

if (selectedFrameType.length && !selectedFrameType.includes("All")) {
  filteredProducts = filteredProducts.filter((p) =>
    selectedFrameType.includes(p.frameType)
  );
}

if (selectedIndex.length && !selectedIndex.includes("All")) {
  filteredProducts = filteredProducts.filter((p) =>
    selectedIndex.includes(p.indice)
  );
}


  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 800);
  };

if (isLoading || isFetching) {
  return (
    <div className="products-loader-container">
      <div className="loader-circle" />
      <p className="loading-text">Chargement des produits...</p>
    </div>
  );
}


 
 return (
  <div className="our-sellers">
    <h2 className="our-sellers-title">Nos Produits</h2>

    <div className="products-page-wrapper">
      {/* 🔍 Left Filter Sidebar */}
      <div className="selectors-wrapper-left">
        <div className="selector-row">
          <SelectorsPageProducts
  options={["Hommes", "Femmes", "Enfants"]}
  label="Catégorie"
  onSelect={setSelectedCategory}
  selected={selectedCategory}
/>

          <SelectorsPageProducts
  options={["Optique", "Solaire", "Lentilles"]}
  label="Sous-catégorie"
  onSelect={setSelectedSubCategory}
  selected={selectedSubCategory}  // ✅ ADD THIS LINE
/>

        </div>

       <div className="selector-row">
  <div className="selector-column">
    <SelectorsPageProducts
  options={uniqueBrands}
  label="Marque"
  onSelect={setSelectedBrand}
  selected={selectedBrand}
/>

<SelectorsPageProducts
  options={["1.5", "1.56", "1.59", "1.6", "1.67", "1.74"]}
  label="Indice"
  onSelect={setSelectedIndex}
  selected={selectedIndex}
/>

<SelectorsPageProducts
  options={frameTypeOptions}
  label="Type de Cadre"
  onSelect={setSelectedFrameType}
  selected={selectedFrameType}
/>

    <SelectorsPageProducts
      options={["1.5", "1.56", "1.59", "1.6", "1.67", "1.74"]}
      label="Indice"
      onSelect={setSelectedIndex}
    />
  </div>

  <div className="selector-column">
    <SelectorsPageProducts
      options={frameTypeOptions}
      label="Type de Cadre"
      onSelect={setSelectedFrameType}
    />
  </div>
</div>

      </div>

      {/* 🛍 Product Grid */}
      <div className="products-grid-wrapper">
        <div className="products-grid">
          {visibleProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <p className="no-products">Aucun produit ne correspond aux filtres.</p>
        )}

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
    </div>
  </div>
);
};

export default Products;