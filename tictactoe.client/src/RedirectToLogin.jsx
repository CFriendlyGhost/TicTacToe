import React, { useEffect } from "react";

const RedirectToCognitoLogin = () => {
  console.log("redirect to cognito method");
  useEffect(() => {
    window.location.href =
      "https://pwc-cognit.auth.us-east-1.amazoncognito.com/login" +
      "?client_id=6v1erj6uv3k1g61r9qqko0u3ep" +
      "&response_type=code" +
      "&scope=email+openid+phone" +
      "&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F";
  }, []);

  return null;
};

export default RedirectToCognitoLogin;
