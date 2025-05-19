import React from "react";
import "../Styles/StylesLoading.css";

const LinaLoader = () => {
  return (
    <div className="lina-loader-wrapper">
      <div className="lina-spinner"></div>
      <p className="lina-loading-text">En cours...</p>
    </div>
  );
};

export default LinaLoader;



