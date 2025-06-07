import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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

  const colorName = color?.colorName;
  const normalizedColor =
    typeof colorName === "object"
      ? color
      : {
          colorName: {
            en: colorName || "Original",
            fr: colorName || "Original",
            ar: "أصلي",
          },
          image: color?.image || coverImage,
        };

  const existingItem = state.cartItems.find(
    (item) =>
      item._id === _id &&
      JSON.stringify(item.color?.colorName) ===
        JSON.stringify(normalizedColor.colorName)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
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

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Produit ajouté au panier",
    showConfirmButton: false,
    timer: 1500,
  });
},


    removeFromCart: (state, action) => {
      const { _id, color } = action.payload;
      const colorName = color?.colorName;
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      state.cartItems = state.cartItems.filter(
        (item) =>
          !(item._id === _id &&
            JSON.stringify(item.color?.colorName) === matchColorName)
      );

      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Product Removed from Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    updateQuantity: (state, action) => {
      const { _id, color, quantity } = action.payload;
      const colorName = color?.colorName;
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      const item = state.cartItems.find(
        (item) =>
          item._id === _id &&
          JSON.stringify(item.color?.colorName) === matchColorName
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
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

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;