const refresh_token = async (refresh_token) => {
  const grantType = "refresh_token";
  const clientId = "6v1erj6uv3k1g61r9qqko0u3ep";

  const requestBody = new URLSearchParams();
  requestBody.append("grant_type", grantType);
  requestBody.append("client_id", clientId);
  requestBody.append("refresh_token", refresh_token);

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

export default refresh_token;
