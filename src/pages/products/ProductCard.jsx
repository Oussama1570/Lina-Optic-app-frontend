import React, { useState, useEffect, useRef } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import "../../Styles/StylesSingleProduct.css";
import { Link } from "react-router-dom";
import "../../Styles/StylesProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const imageRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors?.[0] || {
          colorName: "Default",
          image: product?.coverImage || "/assets/default-image.png",
          stock: product?.stockQuantity || 0,
        }
      );
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    const maxStock = selectedColor?.stock ?? 0;
    setQuantity(value > maxStock ? maxStock : value);
  };

  const handleAddToCart = () => {
    if ((selectedColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(
        addToCart({
          ...product,
          quantity,
          color: selectedColor,
        })
      );
    }
  };

  // 🖱️ Image hover cursor effect
  useEffect(() => {
  const image = imageRef.current;
  const cursor = cursorRef.current;

  const move = (e) => {
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    image.style.transformOrigin = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    image.style.transform = "scale(2)";

    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  };

  const show = () => {
    cursor.style.opacity = 1;
  };

  const hide = () => {
    cursor.style.opacity = 0;
    image.style.transform = "scale(1)";
  };

  if (image && cursor) {
    image.addEventListener("mousemove", move);
    image.addEventListener("mouseenter", show);
    image.addEventListener("mouseleave", hide);
  }

  return () => {
    if (image && cursor) {
      image.removeEventListener("mousemove", move);
      image.removeEventListener("mouseenter", show);
      image.removeEventListener("mouseleave", hide);
    }
  };
}, []);




  if (!product) return null;

  return (
  <div className="product-card-lina">
    {/* 🌟 Hover Cursor (Image Only) */}
    <div className="product-image-wrapper">
      <div className="product-image-cursor" ref={cursorRef}></div>

      <a href={`/products/${product._id}`}>
          <img
            src={getImgUrl(selectedColor?.image ?? product.coverImage)}
            alt={product?.title}
            className="product-image"
            ref={imageRef}
          />
        </a>

      <div
        className={`stock-badge ${
          selectedColor?.stock > 0 ? "in-stock" : "out-of-stock"
        }`}
      >
        {selectedColor?.stock > 0
          ? `Stock: ${selectedColor?.stock}`
          : "Rupture de stock"}
      </div>
    </div>

    <div className="product-info-lina">
      <a href={`/products/${product._id}`} className="product-title-link">
          <h3 className="product-title-lina">{product?.title}</h3>
        </a>

      {product?.description && (
        <p className="product-description-lina">
          {product.description.length > 100
            ? `${product.description.slice(0, 100)}...`
            : product.description}
        </p>
      )}

      <div className="product-price-lina">
        TND{product?.newPrice ?? "0.00"}
        {product?.oldPrice && (
          <span className="old-price-lina">
            TND{Math.round(product?.oldPrice)}
          </span>
        )}
      </div>

      <div className="product-color-lina">
        Couleur: <strong>{selectedColor?.colorName?.en || "Default"}</strong>
      </div>

      <div className="product-controls-lina">
        <input
          type="number"
          min="1"
          max={selectedColor?.stock ?? 0}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={(selectedColor?.stock ?? 0) === 0}
          className="quantity-input-lina"
        />

        <button
          onClick={handleAddToCart}
          disabled={(selectedColor?.stock ?? 0) === 0}
          className={`add-to-cart-btn-lina ${
            selectedColor?.stock > 0 ? "" : "disabled"
          }`}
        >
          <FiShoppingCart className="icon" />
          {selectedColor?.stock > 0
            ? "Ajouter au panier"
            : "Rupture de stock"}
        </button>
      </div>
    </div>
  </div>
);


 
};

export default ProductCard;
