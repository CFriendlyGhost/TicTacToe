import "./App.css";
import "./RedirectToLogin.jsx";
import TicTac from "./components/TicTac";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import React from "react";
import "./TokenService";
import "./RefreshTokenService";
import { useCookies } from "react-cookie";
import RedirectToCognitoLogin from "./RedirectToLogin.jsx";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Lobby from "./components/Lobby";
import getToken from "./TokenService";
import refresh_token from "./RefreshTokenService";

const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [userSymbol, setUserSymbol] = useState("");
  const [roomAvailability, setRoomAvailability] = useState(true);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const code = searchParams.get("code");
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
    "access_token_date",
    "refresh_token_date",
  ]);

  useEffect(() => {
    console.log("code value:", code);
  }, [code]);

  const cleanCookies = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("access_token_date");
    removeCookie("refresh_token_date");
    console.log("cookies cleaned");
  };

  if (!code) {
    console.log("null code");
    return <RedirectToCognitoLogin />;
  }

  if (code == "logout") {
    console.log("code logout");
    cleanCookies();
    return <RedirectToCognitoLogin />;
  }

  useEffect(() => {
    const fetchToken = async () => {
      if (
        cookies.refresh_token == null ||
        cookies.refresh_token_date < Date.now()
      ) {
        try {
          const token = await getToken(code);
          console.log("token data in app: ", token);
          setCookie("access_token", token.access_token);
          setCookie("refresh_token", token.refresh_token);
          setCookie("access_token_date", token.expires_in * 1000 + Date.now());
          setCookie("refresh_token_date", Date.now() + 2592000 * 1000);
          console.log("access token cookie: ", cookies.access_token);
        } catch (error) {
          console.error("Error occurred while fetching token:", error);
        }
      }
    };

    fetchToken();
  }, []);

  const joinRoom = async (user, room) => {
    try {
      setRoomAvailability(true);

      if (cookies.refresh_token_date < Date.now()) {
        const token = await refresh_token(cookies.refresh_token);
        setCookie("access_token", token.access_token);
        setCookie("access_token_date", token.expires_in * 1000 + Date.now());
        console.log("access token after refresh: ", cookies.access_token);
      }

      const connection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        // .withUrl(import.meta.env.VITE_REACT_API_URL)
        .withUrl("http://localhost:8080/tictac", {
          accessTokenFactory: async () => {
            const accessToken = await cookies.access_token;
            return accessToken;
          },
        })
        .build();

      connection.on("ReceiveMove", (user, message) => {
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.on("UsersInRoom", (users, room) => {
        setUsers(users);
      });

      connection.on("Symbol", (symbol) => {
        setUserSymbol(symbol);
      });

      connection.on("JoinRoomResponse", (success, message) => {
        if (!success) {
          setRoomAvailability(false);
          return;
        }

        setConnection(connection);
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const makeMove = async (moveInfo) => {
    try {
      await connection.invoke("MakeMove", moveInfo);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app">
      <h2>Tic Tac Toe{import.meta.env.VITE_REACT_API_URL}</h2>

      <hr className="line" />
      {!connection ? (
        <Lobby joinRoom={joinRoom} />
      ) : roomAvailability ? (
        <TicTac
          connection={connection}
          userSymbol={userSymbol}
          makeMove={makeMove}
          closeConnection={closeConnection}
        />
      ) : (
        <>
          <div className="alert alert-danger" role="alert">
            Room is full
          </div>
        </>
      )}
    </div>
  );
};

export default App;
