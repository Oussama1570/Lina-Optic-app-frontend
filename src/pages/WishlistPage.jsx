import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/features/wishlist/wishlistSlice";
import { getImgUrl } from "../utils/getImgUrl";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../Styles/StylesWishlist.css";

// 🧡 WishlistPage Component
// Displays the user's favorite products stored in the Redux wishlist state
const WishlistPage = () => {
  // 🔄 Access wishlist items from Redux
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dispatch = useDispatch();

  // ❌ Handle removal of a product from the wishlist, with SweetAlert confirmation
  const handleRemove = (id, title) => {
    Swal.fire({
      title: "Retirer ce produit ?",
      text: `"${title}" sera supprimé de vos favoris.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#999",
      confirmButtonText: "Oui, retirer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromWishlist(id)); // Remove from Redux store
        Swal.fire({
          icon: "info",
          title: "Retiré",
          text: `"${title}" a été retiré de vos favoris.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="wishlist-page">
      {/* 🧡 Page Title */}
      <h2 className="wishlist-title-header">🧡 Mes Favoris</h2>

      {/* 🔍 Display message if wishlist is empty */}
      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Aucun produit dans votre liste de souhaits.</p>
      ) : (
        // 📦 Wishlist Grid - Displays favorite products
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div key={product._id} className="wishlist-card">
              {/* 🖼️ Product image with link to product details */}
              <Link to={`/products/${product._id}`} className="wishlist-img-wrapper">
                <img
                  src={getImgUrl(product.coverImage)}
                  alt={product.title}
                  className="wishlist-img"
                />
              </Link>

              {/* 📃 Product Info */}
              <div className="wishlist-info">
                <h3 className="wishlist-title">{product.title}</h3>
                <p className="wishlist-price">TND {product.newPrice}</p>

                {/* ❌ Remove from wishlist button */}
                <button
                  className="remove-wishlist-btn"
                  onClick={() => handleRemove(product._id, product.title)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
