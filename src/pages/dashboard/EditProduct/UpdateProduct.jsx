// 📦 Import React, hooks, API calls, utilities, and styling
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import { getImgUrl } from "../../../utils/getImgUrl";
import "../../../Styles/StylesUpdateProduct.css";

// 🧩 Main component for updating a product
const UpdateProduct = () => {
  // 📌 Get product ID from the route
  const { id } = useParams();

  // 📊 Fetch product data by ID
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);

  // 📝 Initialize form management
  const { register, handleSubmit, setValue } = useForm();

  // 🔄 Setup mutation for updating the product
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  // 🧠 Local state for categories, image, colors
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [colors, setColors] = useState([]);

  // 📋 Options for subcategories
  const subCategoryOptions = [
    { value: "Optique", label: "Lunettes de vue" },
    { value: "Solaire", label: "Lunettes de soleil" },
    { value: "Lentilles", label: "Lentilles de contact" },
  ];

  // 📋 Options for frame types
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

  // ⏬ Prefill form when product data is available
  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("brand", productData.brand || "");
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);
      setValue("trending", productData.trending);
      setValue("frameType", productData.frameType || "");

      setMainCategory(productData.mainCategory || "");
      setSubCategory(productData.subCategory || "");

      // ✅ Set preview image for the cover
      const coverImageUrl = productData.coverImage || "";
      setPreviewURL(
        coverImageUrl.startsWith("http")
          ? coverImageUrl
          : `${getBaseUrl()}${coverImageUrl}`
      );

      // 🎨 Format colors array if present
      if (Array.isArray(productData.colors)) {
        const formattedColors = productData.colors.map((color) => ({
          colorName:
            typeof color.colorName === "object"
              ? color.colorName.en
              : color.colorName || "",
          stock: color.stock || 0,
          images: color.images || [],
          imageFile: [],
          previewURL: [],
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);

  // 📤 Handle main cover image file input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // 🎨 Handle changes in color fields (name, stock, images)
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    updatedColors[index][field] = value;
    setColors(updatedColors);
  };

  // ➕ Add a new empty color block
  const addColor = () => {
    setColors([
      ...colors,
      {
        colorName: "",
        stock: 0,
        images: [],
        imageFile: [],
        previewURL: [],
      },
    ]);
  };

  // ❌ Remove a specific color block
  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // ☁️ Upload a single image to the server
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
    return res.data.image;
  };

  // 📨 Handle form submission to update product
  const onSubmit = async (data) => {
    // ❗ Validate category fields before submitting
    if (!mainCategory || !subCategory) {
      Swal.fire("Error", "Please select a category and subcategory.", "error");
      return;
    }

    // 📤 Upload new cover image if changed
    let coverImage = productData.coverImage || "";
    if (imageFile) {
      coverImage = await uploadImage(imageFile);
    }

    // 🔁 Upload all new images per color and build updated colors array
    const updatedColors = await Promise.all(
      colors.map(async (color) => {
        const uploadedImages = [];

        if (Array.isArray(color.imageFile)) {
          for (const file of color.imageFile) {
            if (file) {
              const uploaded = await uploadImage(file);
              uploadedImages.push(uploaded);
            }
          }
        }

        return {
          colorName: color.colorName,
          stock: Number(color.stock) || 0,
          images: uploadedImages.length > 0 ? uploadedImages : color.images,
        };
      })
    );


       // 📦 Final assembled product data to send to the backend
    const updatedProductData = {
      ...data,
      mainCategory,
      subCategory,
      frameType: data.frameType || "",
      brand: data.brand || "",
      coverImage,
      colors: updatedColors,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: updatedColors[0]?.stock || 0, // Set stock based on first color
    };

    try {
      // 🚀 Attempt to update the product
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Success!", "Product updated successfully!", "success");

      // 🧼 Clear temporary files and previews after update
      setColors((prevColors) =>
        prevColors.map((color) => ({
          ...color,
          imageFile: [],
          previewURL: [],
        }))
      );

      // 🔁 Optionally refetch the product data
      refetch();
    } catch (error) {
      console.error("❌ Update failed:", error?.data || error);
      Swal.fire("Error", "Failed to update product.", "error");
    }
  };

  // ⏳ Show loading or error if data is not ready
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error loading product data.
      </div>
    );

  // 📄 Render update product form
  return (
    <div className="update-product-container">
      <h2 className="update-product-title">Update Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="update-product-form">
        {/* ===== Basic Info ===== */}
        <label>Product Title</label>
        <input {...register("title")} type="text" required />

        <label>Product Description</label>
        <textarea {...register("description")} rows="4" required />

        {/* ===== Category Selectors ===== */}
        <label>Main Category</label>
        <select
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="Hommes">Men</option>
          <option value="Femmes">Women</option>
          <option value="Enfants">Kids</option>
        </select>

        {mainCategory && (
          <>
            <label>Subcategory</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
            >
              <option value="">Select a subcategory</option>
              {subCategoryOptions.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Frame Type</label>
        <select {...register("frameType")}>
          <option value="">Select a frame type</option>
          {frameTypeOptions.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* ===== Pricing ===== */}
        <label>Brand</label>
        <input
          {...register("brand")}
          placeholder="Enter product brand"
          required
        />

        <label>Old Price</label>
        <input
          {...register("oldPrice")}
          type="number"
          placeholder="Previous price"
          required
        />

        <label>New Price</label>
        <input
          {...register("newPrice")}
          type="number"
          placeholder="Current price"
          required
        />

        <label>Stock Quantity</label>
        <input
          {...register("stockQuantity")}
          type="number"
          min="0"
          required
        />

        <div className="checkbox-wrapper">
          <input type="checkbox" {...register("trending")} />
          Mark as Trending
        </div>

        {/* ===== Cover Image Upload ===== */}
        <label>Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewURL && (
          <img src={previewURL} alt="Preview" className="update-cover-preview" />
        )}

        {/* ===== Color Variants ===== */}
        <label>Product Colors</label>
        {colors.map((color, index) => (
          <div key={index} className="color-block">
            <input
              type="text"
              value={color.colorName}
              onChange={(e) =>
                handleColorChange(index, "colorName", e.target.value)
              }
              placeholder="Color name"
              required
            />

            <input
              type="number"
              value={color.stock}
              onChange={(e) =>
                handleColorChange(index, "stock", Number(e.target.value))
              }
              placeholder="Stock quantity"
              required
            />

            {/* Show saved server-side images */}
            {Array.isArray(color.images) &&
              color.images.map((imgUrl, i) => (
                <img
                  key={`saved-${i}`}
                  src={getImgUrl(imgUrl)}
                  alt={`Image ${i + 1}`}
                  className="color-preview"
                />
              ))}

            {/* Show preview for newly uploaded images */}
            {color.previewURL?.map?.((url, i) =>
              url ? (
                <div key={`preview-${i}`} className="image-preview-group">
                  <img src={url} alt={`Preview ${i + 1}`} className="color-preview" />
                </div>
              ) : null
            )}

            {/* Upload inputs for each image slot */}
            {color.imageFile?.map?.((file, i) => (
              <div key={`file-${i}`} className="image-preview-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      const newFiles = [...(color.imageFile || [])];
                      const newPreviews = [...(color.previewURL || [])];
                      newFiles[i] = selectedFile;
                      newPreviews[i] = URL.createObjectURL(selectedFile);
                      handleColorChange(index, "imageFile", newFiles);
                      handleColorChange(index, "previewURL", newPreviews);
                    }
                  }}
                />
              </div>
            ))}

            {/* ➕ Add image input */}
            <button
              type="button"
              onClick={() => {
                const updatedFiles = [...(color.imageFile || []), null];
                const updatedPreviews = [...(color.previewURL || []), ""];
                handleColorChange(index, "imageFile", updatedFiles);
                handleColorChange(index, "previewURL", updatedPreviews);
              }}
              className="btn-add-more-img"
            >
              + Add an image
            </button>

            {/* 🗑️ Delete color */}
            <button
              type="button"
              onClick={() => deleteColor(index)}
              className="btn-delete-color"
            >
              Delete
            </button>
          </div>
        ))}

        {/* ➕ Add new color block */}
        <button type="button" onClick={addColor} className="btn-add-color">
          Add a color
        </button>

        {/* ✅ Submit form */}
        <button type="submit" className="btn-submit">
          {updating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
