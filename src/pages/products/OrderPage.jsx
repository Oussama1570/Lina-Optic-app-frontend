import React from "react";

// 🔄 API hooks for fetching and modifying orders
import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
  useRemoveProductFromOrderMutation,
} from "../../redux/features/orders/ordersApi";

// 🔐 Auth context for the currently logged-in user
import { useAuth } from "../../context/AuthContext";

// 🖼️ Utility to resolve and display image URLs
import { getImgUrl } from "../../utils/getImgUrl";

// 🧢 To control page title and metadata
import { Helmet } from "react-helmet";

// 🌀 Shows while loading data
import LoadingSpinner from "../../components/Loading";

// 🔔 Alerts and prompts
import Swal from "sweetalert2";

// 🌍 Translations for multilingual support
import { useTranslation } from "react-i18next";

// 🔁 Dispatch for triggering Redux actions (e.g. to refresh product stock)
import { useDispatch } from "react-redux";
import { productEventsActions } from "../../redux/features/products/productEventsSlice";

// 🎨 Styles
import "../../Styles/StylesOrderPage.css";

const OrderPage = () => {
  // 🔐 Access current user info
  const { currentUser } = useAuth();

  // 🌐 Translation & language
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // 🧠 Redux dispatcher
  const dispatch = useDispatch();

  // 📧 Extract user's email for fetching their orders
  const userEmail = currentUser?.email;

  // 📦 Fetch all orders placed by this user
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useGetOrderByEmailQuery(userEmail, {
    skip: !userEmail, // ❌ Skip if user isn't logged in
  });

  // ❌ Mutation for deleting an entire order
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // 🧹 Mutation for removing a single product from an order
  const [removeProductFromOrder] = useRemoveProductFromOrderMutation();

  // 🔐 Prevent access if no user is logged in
  if (!userEmail) {
    return (
      <div className="centered-page">
        <p className="text-message">{t("ordersPage.pleaseLogin")}</p>
      </div>
    );
  }

  // 🌀 Show loading spinner while fetching orders
  if (isLoading) return <LoadingSpinner />;

  // 🗑️ Handle full order deletion with confirmation
  const handleDelete = async (orderId) => {
    Swal.fire({
      title: t("ordersPage.confirmDeleteTitle"),
      text: t("ordersPage.confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("ordersPage.confirmDeleteBtn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire(t("ordersPage.deleted"), t("ordersPage.orderDeleted"), "success");
          refetch(); // 🔄 Refresh the order list
          dispatch(productEventsActions.triggerRefetch()); // 🔁 Update product stock UI
        } catch {
          Swal.fire(t("ordersPage.error"), t("ordersPage.orderDeleteFailed"), "error");
        }
      }
    });
  };

  // ❌ Handle removal of a specific product from an order
  const handleDeleteProduct = async (
    orderId,
    productId,
    colorNameObj,
    maxQuantity
  ) => {
    const colorName = colorNameObj?.[lang] || colorNameObj?.en || "Original";
    const productKey = `${productId}|${colorName}`;

    // 📥 Prompt user for quantity to remove
    const { value: quantityToRemove } = await Swal.fire({
      title: t("ordersPage.removeQuantityTitle"),
      input: "number",
      inputLabel: t("ordersPage.removeQuantityLabel", { max: maxQuantity }),
      inputAttributes: { min: 1, max: maxQuantity, step: 1 },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: t("ordersPage.removeBtn"),
      cancelButtonText: t("ordersPage.cancelBtn"),
    });

    if (!quantityToRemove || quantityToRemove <= 0) return;

    try {
      await removeProductFromOrder({ orderId, productKey, quantityToRemove }).unwrap();
      Swal.fire(
        t("ordersPage.removed"),
        t("ordersPage.productRemoved", { qty: quantityToRemove }),
        "success"
      );
      refetch(); // 🔄 Refresh the order list
      dispatch(productEventsActions.triggerRefetch()); // 🔁 Refresh product stock
    } catch {
      Swal.fire(t("ordersPage.error"), t("ordersPage.productRemoveFailed"), "error");
    }
  };


 return (
  <div className="order-page">
    {/* SEO page title */}
    <Helmet>
      <title>{t("ordersPage.title")}</title>
    </Helmet>

    <div className="order-container">
      {/* Title */}
      <h2 className="order-title">{t("ordersPage.yourOrders")}</h2>

      {/* No orders case */}
      {orders.length === 0 ? (
        <p className="text-message">{t("ordersPage.noOrders")}</p>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={order._id} className="order-card">
              {/* Top header info */}
              <div className="order-info-top">
                <p>
                  <strong>{t("ordersPage.orderNumber")}:</strong> {index + 1}
                </p>
                <p>{new Date(order?.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Order details */}
              <p className="order-id">
                {t("ordersPage.orderId")}: {order._id.slice(0, 8)}...
              </p>
              <p>{t("ordersPage.name")}: {order.name}</p>
              <p>{t("ordersPage.email")}: {order.email}</p>
              <p>{t("ordersPage.phone")}: {order.phone}</p>
              <p className="order-total">
                {t("ordersPage.total")}: <span>${order.totalPrice}</span>
              </p>

              {/* Subtitle for product list */}
              <h3 className="order-subtitle">{t("ordersPage.orderedProducts")}</h3>

              {/* List of ordered products */}
              <ul className="order-products">
                {order.products.map((product, idx) => {
                  if (!product.productId) return null;

                  const color =
                    product.color?.colorName?.[lang] || product.color?.colorName?.en;

                  return (
                    <li
                      key={`${product.productId._id}-${idx}`}
                      className="order-product-item"
                    >
                      {/* Product image */}
                      <img
                        src={getImgUrl(product.color?.image || product.productId.coverImage)}
                        alt={product.productId.title}
                        className="product-img"
                      />

                      {/* Product info */}
                      <div className="product-info">
                        <p className="product-title">{product.productId.title}</p>
                        <p>{t("ordersPage.quantity")}: {product.quantity}</p>
                        <p>{t("ordersPage.color")}: {color}</p>

                        {/* Remove product button */}
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              order._id,
                              product.productId._id,
                              product.color.colorName,
                              product.quantity
                            )
                          }
                          className="btn-red"
                        >
                          {t("ordersPage.removeProduct")}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Delete order button */}
              <button
                onClick={() => handleDelete(order._id)}
                className={`btn-delete ${isDeleting ? "btn-disabled" : ""}`}
                disabled={isDeleting}
              >
                {isDeleting
                  ? t("ordersPage.deleting")
                  : t("ordersPage.deleteOrder")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>



  );
};

export default OrderPage;
