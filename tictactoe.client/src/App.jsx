import "./App.css";
import Message from "./components/MessageComponent";
import TicTac from "./components/TicTac";
import { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Lobby from "./components/Lobby";


const App = () => {
    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [userSymbol, setUserSymbol] = useState("");
    const [roomAvailability, setRoomAvailability] = useState(true);

    const joinRoom = async (user, room) => {
        try {
            setRoomAvailability(true);

            const connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7248/tictac")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMove", (user, message) => {
                setMessages(messages => [...messages, { user, message }]);
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
    }


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
    }


    return (
        <div className='app'>
            <h2>Tic Tac Toe</h2>
            <hr className='line' />
            {!connection ? (
                <Lobby joinRoom={joinRoom} />
            ) : (
                    roomAvailability ? (
                        <TicTac connection={connection} userSymbol={userSymbol} makeMove={makeMove} />
                ) : (
                    <>
                        <div className="alert alert-danger" role="alert">Room is full</div>
                    </>
                )
            )}
        </div>
    );

}

export default App;
