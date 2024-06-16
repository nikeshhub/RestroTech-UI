export const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};
