import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./products/ProductCard";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi";
import "../Styles/StylesProducts.css";
import FadeInSection from "../Animations/FadeInSection";
import SelectorsPageProducts from './../components/SelectorProductsPage';
import PriceSlider from "../components/PriceSlider";

// 🧩 Options for frame type filtering
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
  // 🔧 State for selected filters
  const [selectedCategory, setSelectedCategory] = useState(["All"]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(["All"]);
  const [selectedBrand, setSelectedBrand] = useState(["All"]);
  const [selectedFrameType, setSelectedFrameType] = useState(["All"]);

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 📦 Fetch products from API
 const { data: products = [], refetch } = useGetAllProductsQuery(undefined, {
  refetchOnMountOrArgChange: true,
});


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const subCategoryFromUrl = queryParams.get("subCategory");

  const [priceRange, setPriceRange] = useState([0, 600]); // 💰 Default price range

  // 🌐 Auto-select category/subCategory from URL
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory([categoryFromUrl]);
    }
    if (subCategoryFromUrl) {
      setSelectedSubCategory([subCategoryFromUrl]);
    }
  }, [categoryFromUrl, subCategoryFromUrl]);

  // 🧠 Get unique brand list for selector
  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brandsSet);
  }, [products]);

  // 🧹 Apply all filters
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

  filteredProducts = filteredProducts.filter((p) => {
    const price = p.newPrice || p.oldPrice || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // ✂️ Slice visible products for pagination
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // ⬇️ Load more handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 800);
  };

  // ⏳ Loading state
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
    <h2 className="animated-products-title">Nos Produits</h2>

    <div className="products-page-wrapper">
      {/* 🔍 Left Filter Sidebar */}
      <div className="selectors-wrapper-left">
        {/* Row: Catégorie + Sous-catégorie */}
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
            selected={selectedSubCategory}
          />
        </div>

        {/* Row: Marque + Cadre + Prix */}
        <div className="selector-row">
          <div className="selector-column">
            <SelectorsPageProducts
              options={uniqueBrands}
              label="Marque"
              onSelect={setSelectedBrand}
              selected={selectedBrand}
            />

            <FadeInSection delay={0.1}>
              <div className="selector-sidebar-lina">
                <PriceSlider
                  min={0}
                  max={600}
                  priceRange={priceRange}
                  onChange={setPriceRange}
                />
              </div>
            </FadeInSection>
          </div>

          <div className="selector-column">
            <SelectorsPageProducts
              options={frameTypeOptions}
              label="Type de Cadre"
              onSelect={setSelectedFrameType}
              selected={selectedFrameType}
            />
          </div>
        </div>
      </div>

      {/* 🛍 Product Grid */}
      <div className="products-grid-wrapper">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="products-grid">
            {visibleProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
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
