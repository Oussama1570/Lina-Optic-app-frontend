import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({
          _id: product._id,
          color: product.color,
          quantity,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f6fc] py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-[#c4d4e3]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-[#1c3b58]">
            {t("cart.title")}
          </h2>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-medium"
            >
              {t("cart.clear_cart")}
            </button>
          )}
        </div>

        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((product) => (
              <div
                key={`${product._id}-${product.color?.colorName?.en}`}
                className="flex flex-col sm:flex-row gap-5 bg-[#f8fafc] border border-[#cddfea] p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-[#a3bddb] shadow">
                  <img
                    src={getImgUrl(product.color?.image || product.coverImage)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start sm:items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#1c3b58]">
                      <a href={`/products/${product._id}`} className="hover:underline hover:text-[#4f77a7] transition">
                        {product.title}
                      </a>
                    </h3>
                    <p className="text-[#4f77a7] font-semibold text-lg">
                      {(product.newPrice * product.quantity).toFixed(2)} TND
                    </p>
                  </div>

                  <p className="text-sm text-gray-600">
                    {t("cart.category")}: {product.category}
                  </p>

                  <p className="text-sm text-gray-600 capitalize">
                    {t("cart.color")}:{" "}
                    {product.color?.colorName?.[i18n.language] || t("cart.original")}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">{t("cart.qty")}:</label>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product, Number(e.target.value))
                        }
                        className="w-16 border rounded-md px-2 py-1 text-center shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4f77a7]"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromCart(product)}
                      className="px-4 py-1.5 rounded-lg text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition text-sm font-medium"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            {t("cart.empty")}
          </p>
        )}

        {/* Summary */}
        {cartItems.length > 0 && (
          <div className="border-t pt-6 mt-10 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <p>{t("cart.subtotal")}</p>
              <p className="text-[#1c3b58]">{totalPrice} TND</p>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-[#1c3b58] text-white py-3 rounded-lg font-semibold hover:bg-[#285d88] transition"
            >
              {t("cart.proceed_to_checkout")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
