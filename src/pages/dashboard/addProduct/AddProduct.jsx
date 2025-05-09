import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css";
import { CATEGORY_OPTIONS } from "../../../utils/categoryFilters";


const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");
  const [colorInputs, setColorInputs] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");


  const subCategoryOptions = [
    { value: "Optique", label: "Lunettes de vue" },
    { value: "Solaire", label: "Lunettes de soleil" },
    { value: "Lentilles", label: "Lentilles de contact" },
  ];
  
  

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

  const addColorInput = () => {
    setColorInputs([
      ...colorInputs,
      { colorName: "", imageFile: null, previewURL: "", stock: 0 },
    ]);
  };

  const deleteColorInput = (index) => {
    setColorInputs(colorInputs.filter((_, i) => i !== index));
  };

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

  const onSubmit = async (data) => {

    if (!mainCategory || !subCategory) {
      Swal.fire("Erreur", "Veuillez sélectionner une catégorie et une sous-catégorie.", "error");
      return;
    }
    
    let coverImage = "";
    if (coverImageFile instanceof File && coverImageFile.type.startsWith("image/")) {
      coverImage = await uploadImage(coverImageFile);
    }

    const colors = await Promise.all(
      colorInputs.map(async (colorInput) => {
        if (
          colorInput.imageFile instanceof File &&
          colorInput.colorName &&
          colorInput.stock >= 0
        ) {
          const imageUrl = await uploadImage(colorInput.imageFile);
          return {
            colorName: colorInput.colorName, // ✅ Let backend handle translation
            image: imageUrl,
            stock: Number(colorInput.stock),
          };
        }
        return null;
      })
    );

    const filteredColors = colors.filter(Boolean);

    

    const newProductData = {
      ...data,
      mainCategory,
      subCategory,
      frameType: data.frameType || "",
      indice: data.indice || "",
      coverImage,
      colors: filteredColors,
      brand: data.brand || "",
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: filteredColors[0]?.stock || 0,
    };
    

    try {
      await addProduct(newProductData).unwrap();
      Swal.fire("Succès!", "Produit ajouté avec succès!", "success");
      reset();
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([]);
    } catch (error) {
      console.error("❌ Error adding product:", error?.data || error);
      Swal.fire("Erreur!", "Échec de l'ajout du produit.", "error");
    }
  };



  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="add-product-form">
  
        <input
          {...register("title")}
          placeholder="Product Name"
          required
        />
  
        <textarea
          {...register("description")}
          placeholder="Description"
          required
        />
  
  <label>Catégorie principale</label>
<select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} required>
  <option value="">Sélectionnez</option>
  <option value="Hommes">Hommes</option>
  <option value="Femmes">Femmes</option>
  <option value="Enfants">Enfants</option>
</select>


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

<select {...register("frameType")}>
  <option value="">Type de Cadre</option>
  {frameTypeOptions.map((type, idx) => (
    <option key={idx} value={type}>{type}</option>
  ))}
</select>

<label>Indice</label>
<select {...register("indice")}>
  <option value="">Sélectionnez un indice</option>
  <option value="1.5">1.5</option>
  <option value="1.56">1.56</option>
  <option value="1.59">1.59</option>
  <option value="1.6">1.6</option>
  <option value="1.67">1.67</option>
  <option value="1.74">1.74</option>
</select>



<input
  {...register("brand")}
  placeholder="Marque du produit"
  required
/>

  
        <div className="price-grid">
          <input
            {...register("oldPrice")}
            type="number"
            placeholder="Old Price"
            required
          />
          <input
            {...register("newPrice")}
            type="number"
            placeholder="New Price"
            required
          />
        </div>
  
        <div className="checkbox-wrapper">
          <input type="checkbox" {...register("trending")} />
          Mark as Trending
        </div>
  
        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          required
        />
        {coverPreviewURL && (
          <img
            src={coverPreviewURL}
            alt="Main Preview"
            className="cover-preview"
          />
        )}
  
        <label>Product Colors</label>
        {colorInputs.map((input, index) => (
          <div key={index} className="color-block">
            <input
              type="text"
              placeholder="Color Name (EN)"
              value={input.colorName}
              onChange={(e) =>
                handleColorInputChange(index, "colorName", e.target.value)
              }
              required
            />
  
            <input
              type="number"
              placeholder="Stock Quantity"
              value={input.stock}
              onChange={(e) =>
                handleColorInputChange(index, "stock", Number(e.target.value))
              }
              required
            />
  
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  handleColorInputChange(index, "imageFile", file);
                }
              }}
              required
            />
  
            {input.previewURL && (
              <img
                src={input.previewURL}
                alt="Color Preview"
                className="color-preview"
              />
            )}
  
            <button
              type="button"
              onClick={() => deleteColorInput(index)}
              className="btn-delete-color"
            >
              Remove Color
            </button>
          </div>
        ))}
  
        <button
          type="button"
          onClick={addColorInput}
          className="btn-add-color"
        >
          Add Color
        </button>
  
        <button
          type="submit"
          className="btn-submit"
        >
          {isLoading ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
  
}  

export default AddProduct;




