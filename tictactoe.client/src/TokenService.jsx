import { CookiesProvider, useCookies } from "react-cookie";

const getToken = async (code) => {
  console.log("token service code:" + code);
  const grantType = "authorization_code";
  const clientId = "";
  const clientSecrete = "";

  const requestBody = new URLSearchParams();
  requestBody.append("grant_type", grantType);
  requestBody.append("client_id", clientId);
  requestBody.append("code", code);
  requestBody.append("redirect_uri", "http://localhost:5173/");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "",
    },
    body: requestBody,
  };

  try {
    const response = await fetch(
      "https://pwc-cognit.auth.us-east-1.amazoncognito.com/oauth2/token",
      requestOptions
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error occurred while fetching token:", error);
    throw error;
  }
};

export default getToken;
