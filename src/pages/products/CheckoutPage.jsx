import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { useTranslation } from "react-i18next";
import "../../Styles/StylesCheckoutPage.css"

const CheckoutPage = () => {
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        street: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        color:
          typeof item.color?.colorName === "object"
            ? item.color
            : {
                colorName: {
                  en: item.color?.colorName || "Original",
                  fr: item.color?.colorName || "Original",
                  ar: "أصلي",
                },
                image: item.color?.image || item.coverImage || "/assets/default-image.png",
              },
      })),
      totalPrice: totalPrice,
    };

    try {
      const result = await createOrder(newOrder).unwrap();
      if (result) {
        Swal.fire({
          title: t("checkout.order_confirmed"),
          text: t("checkout.success_message"),
          icon: "success",
          confirmButtonColor: "#1c3b58",
          confirmButtonText: t("checkout.go_to_orders"),
        }).then(() => {
          navigate("/orders");
        });
      }
    } catch (error) {
      Swal.fire({
        title: t("checkout.error_title"),
        text: error?.message || t("checkout.error_message"),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-lg font-semibold py-10 text-[#1c3b58]">
        {t("checkout.processing")}
      </div>
    );

return (
  <div className="checkout-container min-h-screen bg-gradient-to-br from-white to-[#f0f6fc] py-10 px-4">
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-[#c4d4e3]">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#1c3b58] mb-6 text-center">{t("checkout.title")}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1c3b58] mb-2">{t("checkout.personalInfo")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("checkout.name")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("checkout.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm break-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("checkout.phone")}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#1c3b58] mb-2">{t("checkout.shippingAddress")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("checkout.address")}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm"
                  required
                />
              </div>

              {/* Row 1: City + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">{t("checkout.city")}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t("checkout.country")}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Region + Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">{t("checkout.region")}</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t("checkout.postalCode")}</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accept Terms */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
            <span>
              {t("checkout.accept")}{" "}
              <a href="/conditions" className="text-blue-600 underline">
                {t("checkout.terms")}
              </a>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-[#1c3b58] text-white py-3 rounded-lg font-semibold hover:bg-[#285d88] transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("checkout.submitting") : t("checkout.submitOrder")}
        </button>
      </form>
    </div>
  </div>
);


  
};

export default CheckoutPage;
