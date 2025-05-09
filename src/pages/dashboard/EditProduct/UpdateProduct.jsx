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
import "../../../Styles/StylesUpdateProduct.css"
import "../../../Styles/StylesUpdateProduct.css"
import { CATEGORY_OPTIONS } from "../../../utils/categoryFilters";


const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [colors, setColors] = useState([]);

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


  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("brand", productData.brand || "");
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);
      setValue("trending", productData.trending);
      setValue("indice", productData.indice || "");
      setValue("frameType", productData.frameType || ""); // ✅ Add this line
  
      setMainCategory(productData.mainCategory || "");
      setSubCategory(productData.subCategory || "");
  
  
      const coverImageUrl = productData.coverImage || "";
      setPreviewURL(
        coverImageUrl.startsWith("http")
          ? coverImageUrl
          : `${getBaseUrl()}${coverImageUrl}`
      );
  
      if (Array.isArray(productData.colors)) {
        const formattedColors = productData.colors.map((color) => ({
          colorName:
            typeof color.colorName === "object"
              ? color.colorName.en
              : color.colorName || "",
          image: color.image || "",
          stock: color.stock || 0,
          imageFile: null,
          previewURL:
            color.image && color.image.startsWith("http")
              ? color.image
              : `${getBaseUrl()}${color.image}`,
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);
  
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    if (field === "imageFile") {
      updatedColors[index][field] = value;
      updatedColors[index].previewURL = URL.createObjectURL(value);
    } else {
      updatedColors[index][field] = value;
    }
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([
      ...colors,
      { colorName: "", stock: 0, imageFile: null, previewURL: "" },
    ]);
  };

  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
    return res.data.image;
  };

  const onSubmit = async (data) => {
    if (!mainCategory || !subCategory) {
      Swal.fire("Erreur", "Veuillez sélectionner une catégorie et une sous-catégorie.", "error");
      return;
    }

    
  
    let coverImage = productData.coverImage || "";
    if (imageFile) {
      coverImage = await uploadImage(imageFile);
    }
  
    const updatedColors = await Promise.all(
      colors.map(async (color) => {
        let imageUrl = color.image || "";
        if (color.imageFile) {
          imageUrl = await uploadImage(color.imageFile);
        }
  
        return {
          colorName: color.colorName,
          image: imageUrl,
          stock: Number(color.stock) || 0,
        };
      })
    );
  
    const updatedProductData = {
      ...data,
      mainCategory,
      subCategory,
      frameType: data.frameType || "",
      indice: data.indice || "",
      brand: data.brand || "",
      coverImage,
      colors: updatedColors,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: updatedColors[0]?.stock || 0,
    };
    
  
    console.log("📦 Updating Product:", updatedProductData);
  
    try {
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Succès !", "Produit mis à jour avec succès !", "success");
      refetch();
    } catch (error) {
      console.error("❌ Update failed:", error?.data || error);
      Swal.fire("Erreur !", "Échec de la mise à jour du produit.", "error");
    }
  };
  



if (isLoading) return <Loading />;
if (isError) return <div className="text-center text-red-500">Erreur lors de la récupération des données du produit.</div>;


return (
  <div className="update-product-container">
    <h2 className="update-product-title">Update Product</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="update-product-form">
      
    <label>Nom du produit</label>
<input {...register("title")} type="text" required />

<label>Description du produit</label>
<textarea {...register("description")} rows="4" required />


<label>Catégorie principale</label>
<select
  value={mainCategory}
  onChange={(e) => setMainCategory(e.target.value)}
  required
>
  <option value="">Sélectionnez une catégorie</option>
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
      <option value="">Sélectionnez une sous-catégorie</option>
      {subCategoryOptions.map((option, idx) => (
        <option key={idx} value={option.value}>{option.label}</option>
      ))}
    </select>
  </>
)}

<label>Type de Cadre</label>
<select {...register("frameType")}>
  <option value="">Sélectionnez un type de cadre</option>
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

<label>Marque</label>
<input
  {...register("brand")}
  placeholder="Entrez la marque du produit"
  required
/>

<label>Prix Ancien</label>
<input {...register("oldPrice")} type="number" placeholder="Ancien prix" required />

<label>Prix Nouveau</label>
<input {...register("newPrice")} type="number" placeholder="Nouveau prix" required />

<label>Quantité en Stock</label>
<input {...register("stockQuantity")} type="number" min="0" required />


      <div className="checkbox-wrapper">
        <input type="checkbox" {...register("trending")} />
        Mark as Trending
      </div>

      <label>Main Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewURL && (
        <img
          src={previewURL}
          alt="Main Preview"
          className="update-cover-preview"
        />
      )}

      <label>Product Colors</label>
      {colors.map((color, index) => (
        <div key={index} className="color-block">
          <input
            type="text"
            value={color.colorName}
            onChange={(e) =>
              handleColorChange(index, "colorName", e.target.value)
            }
            placeholder="Color Name (EN)"
            required
          />

          <input
            type="number"
            value={color.stock}
            onChange={(e) =>
              handleColorChange(index, "stock", Number(e.target.value))
            }
            placeholder="Stock Quantity"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleColorChange(index, "imageFile", e.target.files[0])
            }
          />

          {color.previewURL && (
            <img
              src={color.previewURL}
              alt="Color Preview"
              className="color-preview"
            />
          )}

          <button
            type="button"
            onClick={() => deleteColor(index)}
            className="btn-delete-color"
          >
            Remove Color
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addColor}
        className="btn-add-color"
      >
        Add Color
      </button>

      <button
        type="submit"
        className="btn-submit"
      >
        {updating ? "Updating..." : "Update Product"}
      </button>
    </form>
  </div>
);

};

export default UpdateProduct;
