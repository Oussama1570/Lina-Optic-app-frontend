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
      setValue("frameType", productData.frameType || "");

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
          stock: color.stock || 0,
          images: color.images || [],
          imageFile: [],
          previewURL: [],
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    updatedColors[index][field] = value;
    setColors(updatedColors);
  };

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
      stockQuantity: updatedColors[0]?.stock || 0,
    };

    try {
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Succès !", "Produit mis à jour avec succès !", "success");

      // ✅ Clear temp files to avoid image duplication
      setColors((prevColors) =>
        prevColors.map((color) => ({
          ...color,
          imageFile: [],
          previewURL: [],
        }))
      );

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
      <h2 className="update-product-title">Mettre à jour le produit</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="update-product-form">

        <label>Nom du produit</label>
        <input {...register("title")} type="text" required />

        <label>Description du produit</label>
        <textarea {...register("description")} rows="4" required />

        <label>Catégorie principale</label>
        <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} required>
          <option value="">Sélectionnez une catégorie</option>
          <option value="Hommes">Hommes</option>
          <option value="Femmes">Femmes</option>
          <option value="Enfants">Enfants</option>
        </select>

        {mainCategory && (
          <>
            <label>Sous-catégorie</label>
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
              <option value="">Sélectionnez une sous-catégorie</option>
              {subCategoryOptions.map((option, idx) => (
                <option key={idx} value={option.value}>{option.label}</option>
              ))}
            </select>
          </>
        )}

        <label>Type de cadre</label>
        <select {...register("frameType")}>
          <option value="">Sélectionnez un type de cadre</option>
          {frameTypeOptions.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        <label>Marque</label>
        <input {...register("brand")} placeholder="Entrez la marque du produit" required />

        <label>Prix ancien</label>
        <input {...register("oldPrice")} type="number" placeholder="Ancien prix" required />

        <label>Prix actuel</label>
        <input {...register("newPrice")} type="number" placeholder="Nouveau prix" required />

        <label>Quantité en stock</label>
        <input {...register("stockQuantity")} type="number" min="0" required />

        <div className="checkbox-wrapper">
          <input type="checkbox" {...register("trending")} />
          Marquer comme tendance
        </div>

        <label>Image principale</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewURL && <img src={previewURL} alt="Aperçu" className="update-cover-preview" />}

        <label>Couleurs du produit</label>
        {colors.map((color, index) => (
          <div key={index} className="color-block">
            <input
              type="text"
              value={color.colorName}
              onChange={(e) => handleColorChange(index, "colorName", e.target.value)}
              placeholder="Nom de la couleur"
              required
            />

            <input
              type="number"
              value={color.stock}
              onChange={(e) => handleColorChange(index, "stock", Number(e.target.value))}
              placeholder="Quantité en stock"
              required
            />

            {/* 🌐 Existing saved images */}
            {Array.isArray(color.images) && color.images.map((imgUrl, i) => (
              <img
                key={`saved-${i}`}
                src={getImgUrl(imgUrl)}
                alt={`Image ${i + 1}`}
                className="color-preview"
              />
            ))}

            {/* 🖼️ Dynamically uploaded previews */}
            {color.previewURL?.map?.((url, i) =>
              url ? (
                <div key={`preview-${i}`} className="image-preview-group">
                  <img src={url} alt={`Preview ${i + 1}`} className="color-preview" />
                </div>
              ) : null
            )}

            {/* 📁 File uploaders for each new image */}
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

            {/* ➕ Add new file input */}
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
              + Ajouter une image
            </button>

            <button
              type="button"
              onClick={() => deleteColor(index)}
              className="btn-delete-color"
            >
              Supprimer
            </button>
          </div>
        ))}

        <button type="button" onClick={addColor} className="btn-add-color">
          Ajouter une couleur
        </button>

        <button type="submit" className="btn-submit">
          {updating ? "Mise à jour..." : "Mettre à jour le produit"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
