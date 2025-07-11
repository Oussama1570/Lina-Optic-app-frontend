// 🛠 Import necessary tools from Redux Toolkit and SweetAlert2 for notifications
import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// 🧾 Initial cart state with an empty cart
const initialState = {
  cartItems: [],
};

// 🧩 Create a Redux slice for cart management
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Add item to the cart
    addToCart: (state, action) => {
      const {
        _id,
        title,
        newPrice,
        mainCategory,
        subCategory,
        brand,
        coverImage,
        color,
        quantity,
      } = action.payload;

      // 🎨 Normalize color structure (multilingual support)
      const colorName = color?.colorName;
      const normalizedColor =
        typeof colorName === "object"
          ? color // Already multilingual
          : {
              colorName: {
                en: colorName || "Original",
                fr: colorName || "Original",
                ar: "أصلي",
              },
              image: color?.image || coverImage,
            };

      // 🔍 Check if the item with the same color is already in the cart
      const existingItem = state.cartItems.find(
        (item) =>
          item._id === _id &&
          JSON.stringify(item.color?.colorName) ===
            JSON.stringify(normalizedColor.colorName)
      );

      if (existingItem) {
        // 🧮 Increase quantity if item already exists in cart
        existingItem.quantity += quantity;
      } else {
        // ➕ Otherwise, add new item to the cart
        state.cartItems.push({
          _id,
          title,
          newPrice,
          mainCategory,
          subCategory,
          brand,
          coverImage,
          quantity: quantity || 1,
          color: normalizedColor,
        });
      }

      // 🔔 Notify user with success message
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Produit ajouté au panier",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    // ❌ Remove item from the cart
    removeFromCart: (state, action) => {
      const { _id, color } = action.payload;
      const colorName = color?.colorName;

      // 🎯 Normalize color name for accurate comparison
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      // ❌ Remove the matching item from the cart
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(item._id === _id &&
            JSON.stringify(item.color?.colorName) === matchColorName)
      );

      // 🔔 Notify user
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Product Removed from Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    // 🔁 Update the quantity of a cart item
    updateQuantity: (state, action) => {
      const { _id, color, quantity } = action.payload;
      const colorName = color?.colorName;

      // 🧩 Match the color name
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      // 🔍 Find the cart item to update
      const item = state.cartItems.find(
        (item) =>
          item._id === _id &&
          JSON.stringify(item.color?.colorName) === matchColorName
      );

      // ✏️ Update quantity
      if (item) {
        item.quantity = quantity;
      }
    },

    // 🧹 Clear all items from the cart
    clearCart: (state) => {
      state.cartItems = [];

      // 🔔 Notify user
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Cart Cleared",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
});

// 🚀 Export actions and reducer
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
