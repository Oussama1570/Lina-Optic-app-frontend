import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { triggerRefetch, resetTrigger } from "../../../redux/features/products/productEventsSlice.js";
import "../../../Styles/StylesManageProducts.css";



const ManageProducts = () => {
  const { data: products = [], isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();
  const shouldRefetch = useSelector((state) => state.productEvents.shouldRefetch);




  // 🔍 Search term state
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
  if (shouldRefetch) {
    refetch();
    dispatch(resetTrigger()); // ✅ fixed this line
  }
}, [shouldRefetch, refetch, dispatch]);

  const handleDeleteProduct = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimez-le !",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Supprimé !", "Le produit a été supprimé.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Erreur !",
          error?.data?.message || "Échec de la suppression du produit. Veuillez réessayer.",
          "error"
        );
      }
    }
  };

  // 💡 Filter products by ID based on search term
  const filteredProducts = products.filter((product) =>
    product._id.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );



   return (
    <section className="w-full bg-gray-50 min-h-screen px-2 md:px-6 py-6">
      {/* 🧭 Header */}
      <header className="w-full bg-white shadow px-4 md:px-6 py-4 mb-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center md:text-left">
          Gérer les Produits
        </h2>
        {/* 🔍 Search input */}
        <input
          type="text"
          placeholder="Rechercher par ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </header>

      {/* 📋 Product Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full products-table">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              <th className="p-4 border border-gray-300">#</th>
              <th className="p-4 border border-gray-300">ID</th>
              <th className="p-4 border border-gray-300">Produit</th>
              <th className="p-4 border border-gray-300">Marque</th>
              <th className="p-4 border border-gray-300">Catégorie</th>
              <th className="p-4 border border-gray-300">Couleurs</th>
              <th className="p-4 border border-gray-300">Prix</th>
              <th className="p-4 border border-gray-300">Stock</th>
              <th className="p-4 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="9" className="text-center p-6 border border-gray-300">
                  Chargement des produits...
                </td>
              </tr>
            )}

            {!isLoading && filteredProducts?.length > 0 ? (
              filteredProducts.map((product, index) => {
                const totalStock = product.colors?.reduce(
                  (sum, color) => sum + (color?.stock || 0),
                  0
                );

                return (
                  <tr key={product._id} className="hover:bg-gray-100 transition">
                    <td className="p-4 border border-gray-300 align-middle">{index + 1}</td>

                    <td className="p-4 border border-gray-300 align-middle text-sm text-gray-600">
                      {product._id.slice(0, 8)}...
                    </td>

                    <td className="p-4 border border-gray-300">
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="font-medium text-gray-800 mt-2 text-sm md:text-base break-words">
                          {product.title}
                        </span>
                        <img
                          src={getImgUrl(product.coverImage)}
                          alt={product.title}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border mt-2"
                        />
                      </div>
                    </td>

                    <td className="p-4 border border-gray-300 text-sm text-gray-700">
                      {product.brand || "—"}
                    </td>

                    <td className="p-4 border border-gray-300 align-middle capitalize text-gray-700">
                      {product.mainCategory || "—"} / {product.subCategory || "—"}
                    </td>

                    <td className="p-4 border border-gray-300 align-middle">
                      <div className="flex flex-col gap-3">
                        {product.colors?.length > 0 ? (
                          product.colors.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-3 flex-wrap">
                              {color.images?.map((img, i) => (
                                <img
                                  key={i}
                                  src={getImgUrl(img)}
                                  alt={color.colorName?.[lang] || color.colorName?.en}
                                  className="w-8 h-8 rounded object-cover border"
                                  title={color.colorName?.[lang] || color.colorName?.en}
                                />
                              ))}
                              <span className="text-sm text-gray-700">
                                {color.colorName?.[lang] || color.colorName?.en || "Défaut"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">Par défaut</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 border border-gray-300 align-middle text-green-600 font-semibold">
                      {product.newPrice} TND
                    </td>

                    <td className="p-4 border border-gray-300 align-middle">
                      <span
                        className={
                          totalStock === 0
                            ? "text-red-500 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {totalStock > 0 ? `${totalStock} en stock` : "Rupture de stock"}
                      </span>
                    </td>

                    <td className="p-4 border border-gray-300 align-middle">
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                        <Link
                          to={`/dashboard/edit-product/${product._id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 w-full sm:w-auto text-center"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deleting}
                          className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-700 w-full sm:w-auto"
                        >
                          {deleting ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              !isLoading && (
                <tr>
                  <td colSpan="9" className="text-center p-6 border border-gray-300">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageProducts;



