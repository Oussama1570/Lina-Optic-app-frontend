import React, { useState, useEffect } from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/features/wishlist/wishlistSlice";
import "../../Styles/StylesProductCard.css";

// 🛍️ Main product card component
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(null);

  // 🌟 Access wishlist from Redux store
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  // 🎨 Set initial selected color or fallback to default image
  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors?.[0] || {
          image: product.coverImage || "/assets/default-image.png",
          stock: product.stockQuantity || 0,
        }
      );
    }
  }, [product]);

  // ➕ Add product to cart with selected color
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
        color: selectedColor,
      })
    );
  };

  // 💖 Toggle wishlist state (add/remove)
  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      Swal.fire({
        icon: "info",
        title: "Retiré des favoris",
        text: `${product.title} a été retiré de votre liste.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      dispatch(addToWishlist(product));
      Swal.fire({
        icon: "success",
        title: "Ajouté aux favoris",
        text: `${product.title} a été ajouté à votre liste.`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // 🔢 Calculate discount percentage if applicable
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="product-card-optic">
      {/* 🏷️ Discount Badge */}
      {discountPercent > 0 && (
        <span className="discount-badge">-{discountPercent}%</span>
      )}

      {/* 🔗 Product Image + Badges */}
      <a href={`/products/${product._id}`} className="image-box" style={{ position: "relative" }}>
  {/* ✨ Trending + Stock */}
  {product?.trending && (
    <>
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          backgroundColor: "#005fa3",
          color: "#fff",
          fontSize: "0.75rem",
          padding: "3px 8px",
          borderRadius: "4px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          zIndex: 1,
        }}
      >
        <HiOutlineSparkles style={{ fontSize: "1rem" }} />
        Tendance
      </div>

      <div
        style={{
          position: "absolute",
          top: "34px",
          right: "8px",
          backgroundColor: selectedColor?.stock > 0 ? "#28a745" : "#dc3545",
          color: "#fff",
          fontSize: "0.7rem",
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: "normal",
          zIndex: 1,
        }}
      >
        {selectedColor?.stock > 0
          ? `Stock: ${selectedColor.stock}`
          : "Rupture de stock"}
      </div>
    </>
  )}
  <img
    src={getImgUrl(selectedColor?.image)}
    alt={product?.title}
    className="product-img"
  />
</a>


      {/* 📊 Stock Info Below Image */}
      <div
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          marginTop: "4px",
        }}
      >
        {selectedColor?.stock > 0
          ? `Stock: ${selectedColor.stock}`
          : "Rupture de stock"}
      </div>

      {/* 📄 Product Details */}
      <div className="product-details-box">
        <h3 className="product-title-optic">{product?.title}</h3>
        <p className="product-sub-info">
          {product?.subCategory}, {product?.mainCategory}
        </p>
        <p className="product-brand">{product?.brand}</p>

        {/* 💵 Pricing */}
        <div className="product-price-optic">
          {product.oldPrice && (
            <span className="old-price">TND{Math.round(product.oldPrice)}</span>
          )}
          <span className="new-price">TND{product?.newPrice}</span>
        </div>
      </div>

      {/* 🎯 Hover Icons (cart, wishlist, view) */}
      <div className="hover-icons">
        <button className="add-btn" onClick={handleAddToCart}>
          <FiShoppingCart />
          ADD TO CART
        </button>

        <span
          className="icon"
          onClick={handleToggleWishlist}
          style={{ cursor: "pointer" }}
        >
          <FiHeart className="icon" />
        </span>

        <a href={`/products/${product._id}`} className="icon">
        <FiEye />
        </a>

      </div>
    </div>
  );
};

export default ProductCard;
