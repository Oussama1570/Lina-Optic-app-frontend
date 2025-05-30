const getBaseUrl = () => {
  const local = "http://localhost:5000";
  const deployed = "https://lina-optic-app-backend.vercel.app";

  // Automatically switch based on environment
  if (import.meta.env.MODE === "development") {
    return local;
  }

  return deployed;
};

export default getBaseUrl;