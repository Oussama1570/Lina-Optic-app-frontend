// 📦 Import React and necessary libraries
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css";

// 🌐 Import predefined category filters
import { CATEGORY_OPTIONS } from "../../../utils/categoryFilters";

const AddProduct = () => {
  // 📥 Initialize form management hook
  const { register, handleSubmit, reset } = useForm();

  // 🖼️ Cover image state and preview
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");

  // 🎨 State to manage color blocks (each with name, images, stock)
  const [colorInputs, setColorInputs] = useState([]);

  // 🚀 RTK Query mutation hook to add product
  const [addProduct, { isLoading }] = useAddProductMutation();

  // 🧭 Category selection states
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // 📂 Predefined sub-category options
  const subCategoryOptions = [
    { value: "Optique", label: "Lunettes de vue" },
    { value: "Solaire", label: "Lunettes de soleil" },
    { value: "Lentilles", label: "Lentilles de contact" },
  ];

  // 🖼️ Frame type selector options
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

  // 📷 Handle cover image file selection and preview generation
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreviewURL(url);
    } else {
      setCoverImageFile(null);
      setCoverPreviewURL("");
    }
  };

  // 🎨 Handle changes for color input fields (name, image files, stock)
  const handleColorInputChange = (index, field, value) => {
    const newInputs = [...colorInputs];
    if (field === "imageFile" && value instanceof File && value.type.startsWith("image/")) {
      newInputs[index][field] = value;
      newInputs[index].previewURL = URL.createObjectURL(value);
    } else {
      newInputs[index][field] = value;
    }
    setColorInputs(newInputs);
  };

  // ➕ Add a new empty color block
  const addColorInput = () => {
    setColorInputs([
      ...colorInputs,
      { colorName: "", imageFile: null, previewURL: "", stock: 0 },
    ]);
  };

  // ❌ Remove a specific color block
  const deleteColorInput = (index) => {
    setColorInputs(colorInputs.filter((_, i) => i !== index));
  };

  // ☁️ Upload a single image to the backend (used for both cover & color images)
  const uploadImage = async (file) => {
    if (!file || !(file instanceof File) || !file.type.startsWith("image/")) return "";
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.image;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      return "";
    }
  };


  // 📤 Handle form submission
  const onSubmit = async (data) => {
    // ✅ Validate category selection before submitting
    if (!mainCategory || !subCategory) {
      Swal.fire("Erreur", "Veuillez sélectionner une catégorie et une sous-catégorie.", "error");
      return;
    }

    // 🖼️ Upload the cover image if it’s a valid image file
    let coverImage = "";
    if (coverImageFile instanceof File && coverImageFile.type.startsWith("image/")) {
      coverImage = await uploadImage(coverImageFile);
    }

    // 🎨 Process color blocks: upload each color's images and structure color data
    const colors = await Promise.all(
      colorInputs.map(async (input) => {
        if (
          input.colorName &&
          Array.isArray(input.imageFiles) &&
          input.stock >= 0
        ) {
          const uploadedImages = [];

          // ☁️ Upload each image file for this color
          for (const file of input.imageFiles) {
            if (file && file.type.startsWith("image/")) {
              const imageUrl = await uploadImage(file);
              uploadedImages.push(imageUrl);
            }
          }

          // 🎯 Return color object in multilingual format with images and stock
          return {
            colorName: {
              en: input.colorName,
              fr: input.colorName, // Optional: replace with translations if needed
              ar: input.colorName,
            },
            images: uploadedImages,
            stock: Number(input.stock),
          };
        }

        return null; // ⛔ Skip invalid color blocks
      })
    );

    // 🧼 Remove null values (failed or empty color blocks)
    const filteredColors = colors.filter(Boolean);

    // 📦 Construct final product data to send
    const newProductData = {
      ...data,
      mainCategory,
      subCategory,
      frameType: data.frameType || "",
      coverImage,
      colors: filteredColors,
      brand: data.brand || "",
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: filteredColors[0]?.stock || 0, // Initial stock from first color
    };

    try {
      // 🚀 Submit product using RTK Query mutation
      await addProduct(newProductData).unwrap();

      // ✅ Success alert and reset form
      Swal.fire("Succès!", "Produit ajouté avec succès!", "success");
      reset();
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([]);
    } catch (error) {
      // ❌ Error handling on failure
      console.error("❌ Error adding product:", error?.data || error);
      Swal.fire("Erreur!", "Échec de l'ajout du produit.", "error");
    }
  };


    // 🧾 Render the form UI
  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Ajouter un nouveau produit</h2>

      {/* 📝 Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="add-product-form">

        {/* 🏷️ Product Title */}
        <label>Nom du produit</label>
        <input
          {...register("title")}
          placeholder="Nom du produit"
          required
        />

        {/* 🧾 Product Description */}
        <label>Description du produit</label>
        <textarea
          {...register("description")}
          placeholder="Description"
          required
        />

        {/* 📁 Main Category Selector */}
        <label>Catégorie principale</label>
        <select
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          required
        >
          <option value="">Sélectionner</option>
          <option value="Hommes">Hommes</option>
          <option value="Femmes">Femmes</option>
          <option value="Enfants">Enfants</option>
        </select>

        {/* 📂 Show sub-category selector only if mainCategory is selected */}
        {mainCategory && (
          <>
            <label>Sous-catégorie</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
            >
              <option value="">Sous-catégorie</option>
              {subCategoryOptions.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}

        {/* 🖼️ Frame Type Selector */}
        <label>Type de cadre</label>
        <select {...register("frameType")}>
          <option value="">Type de cadre</option>
          {frameTypeOptions.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        {/* 🏷️ Brand Field */}
        <label>Marque</label>
        <input
          {...register("brand")}
          placeholder="Marque du produit"
          required
        />

        {/* 💰 Old & New Prices */}
        <div className="price-grid">
          <input
            {...register("oldPrice")}
            type="number"
            placeholder="Prix initial"
            required
          />
          <input
            {...register("newPrice")}
            type="number"
            placeholder="Prix actuel"
            required
          />
        </div>

        {/* 📈 Trending Checkbox */}
        <div className="checkbox-wrapper">
          <input type="checkbox" {...register("trending")} />
          Marquer comme tendance
        </div>

        {/* 🖼️ Cover Image Upload */}
        <label>Image principale</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          required
        />

        {/* 🖼️ Cover Image Preview */}
        {coverPreviewURL && (
          <img
            src={coverPreviewURL}
            alt="Aperçu"
            className="cover-preview"
          />
        )}

        {/* 🎨 Product Colors Section */}
        <label>Couleurs du produit</label>
        {colorInputs.map((input, index) => (
          <div key={index} className="color-block">
            {/* 🎨 Color Name Input */}
            <input
              type="text"
              placeholder="Nom de la couleur"
              value={input.colorName}
              onChange={(e) =>
                handleColorInputChange(index, "colorName", e.target.value)
              }
              required
            />

            {/* 🔢 Stock Quantity Input */}
            <input
              type="number"
              placeholder="Quantité en stock"
              value={input.stock}
              onChange={(e) =>
                handleColorInputChange(index, "stock", Number(e.target.value))
              }
              required
            />


                     {/* 🔁 Loop through multiple image previews */}
            {input.imageFiles?.map((file, i) => (
              <div key={i} className="image-preview-group">
                {/* 📤 Upload input for each image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      const newFiles = [...(input.imageFiles || [])];
                      const newPreviews = [...(input.previewURLs || [])];
                      newFiles[i] = file;
                      newPreviews[i] = URL.createObjectURL(file);
                      handleColorInputChange(index, "imageFiles", newFiles);
                      handleColorInputChange(index, "previewURLs", newPreviews);
                    }
                  }}
                />

                {/* 🖼️ Show image preview if available */}
                {input.previewURLs?.[i] && (
                  <img
                    src={input.previewURLs[i]}
                    alt={`Aperçu ${i + 1}`}
                    className="color-preview"
                  />
                )}
              </div>
            ))}

            {/* ➕ Button to add another image input for this color */}
            <button
              type="button"
              onClick={() => {
                const newFiles = [...(input.imageFiles || []), null];
                const newPreviews = [...(input.previewURLs || []), ""];
                handleColorInputChange(index, "imageFiles", newFiles);
                handleColorInputChange(index, "previewURLs", newPreviews);
              }}
              className="btn-add-more-img"
            >
              + Ajouter une image
            </button>

            {/* ❌ Button to delete this entire color block */}
            <button
              type="button"
              onClick={() => deleteColorInput(index)}
              className="btn-delete-color"
            >
              Supprimer
            </button>
          </div>
        ))}

        {/* ➕ Add a new empty color block */}
        <button
          type="button"
          onClick={addColorInput}
          className="btn-add-color"
        >
          Ajouter une couleur
        </button>

        {/* ✅ Submit form button */}
        <button
          type="submit"
          className="btn-submit"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
