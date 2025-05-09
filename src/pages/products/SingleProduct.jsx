import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import "../../Styles/StylesSingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

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

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setQuantity(1);
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

  if (isLoading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (isError || !product)
    return <div className="text-center py-10 text-red-600">Error loading product info</div>;

  return (
    <div className="single-product-container">
      <h1 className="product-title">{product?.title}</h1>

      <div className="product-content">
        <div>
          <div className="product-image-box">
            <img
              src={getImgUrl(selectedColor?.image ?? "/assets/default-image.png")}
              alt={product?.title}
              className="product-main-image"
            />
            <div className={`stock-badge ${selectedColor?.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {selectedColor?.stock > 0
                ? `Stock: ${selectedColor?.stock}`
                : "Rupture de stock"}
            </div>
          </div>

          <div className="product-colors">
            <label>Couleurs disponibles:</label>
            <div className="color-options">
              {product?.colors?.map((color, index) => {
                const stock = color?.stock ?? 0;
                const name = color?.colorName?.en || "Default";
                const isSelected = selectedColor?.colorName?.en === color?.colorName?.en;

                return (
                  <div key={index} className="color-option">
                    <img
                      src={getImgUrl(color?.image)}
                      alt={name}
                      className={`color-image ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectColor(color)}
                    />
                    <div className={`color-stock ${stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      {stock > 0 ? stock : "Rupture de stock"}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="selected-color">
              Couleur sélectionnée: <strong>{selectedColor?.colorName?.en || "Default"}</strong>
            </p>
          </div>
        </div>

        <div className="product-details">
          <p className="product-description">{product?.description}</p>

          <div className="product-meta">
            <p><strong>Marque:</strong> {product?.brand || "Inconnu"}</p>
            <p><strong>Catégorie principale:</strong> {product?.mainCategory || "Inconnu"}</p>
            <p><strong>Sous-catégorie:</strong> {product?.subCategory || "Inconnu"}</p>
            <p><strong>Indice:</strong> {product?.indice || "Inconnu"}</p>
            <p><strong>Publié:</strong> {product?.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : "Inconnu"}</p>
          </div>

          <div className="product-price">
            <span className="new">TND{product?.newPrice ?? "0.00"}</span>
            {product?.oldPrice && (
              <span className="old">TND{Math.round(product?.oldPrice)}</span>
            )}
          </div>

          <div className="product-stock-info">
            <strong>Stock:</strong>{" "}
            {selectedColor?.stock > 0 ? selectedColor.stock : "Rupture de stock"}
          </div>

          <div className="product-quantity">
            <label>Quantité:</label>
            <input
              type="number"
              min="1"
              max={selectedColor?.stock ?? 0}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={(selectedColor?.stock ?? 0) === 0}
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={(selectedColor?.stock ?? 0) === 0}
            className={`add-to-cart-btn ${selectedColor?.stock > 0 ? "enabled" : "disabled"}`}
          >
            <FiShoppingCart className="icon" />
            {selectedColor?.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
