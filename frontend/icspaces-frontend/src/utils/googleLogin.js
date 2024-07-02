const navigate = (url) => {
  window.location.href = url;
};

const googleLogin = async () => {
  const response = await fetch("http://localhost:3001/auth/google", {
    method: "POST",
  });
  const data = await response.json(); // user data
  navigate(data.url);
};

export default googleLogin;
