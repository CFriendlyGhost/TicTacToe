import { useState } from "react";
import { useEffect } from "react";
import Square from "./Square";

function TicTac({ connection, userSymbol, makeMove, closeConnection}) {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [turn, setTurn] = useState("O");
    const [gameEnd, setGameEnd] = useState("");


    useEffect(() => {
        connection.on("NextPlayer", (nextPlayer) => {
            setTurn(nextPlayer);
        });

        connection.on("UpdateBoard", (newBoard, play) => {
            setBoard(newBoard);
        });

        connection.on("GameResult", (gameResult) => {
            setGameEnd(gameResult);
        });
    }, []);

    const chooseSquare = (square) => {
        if (turn === userSymbol && board[square] === "" && !gameEnd) {
            const newBoard = [...board];
            newBoard[square] = userSymbol;
            setBoard(newBoard);
            const moveInfo = { board: newBoard, player: userSymbol };
            makeMove(moveInfo);
        }
    };


    return (
        <>
            {gameEnd.length > 0 && <div className="alert alert-success" role="alert">{gameEnd}</div>
            }
            <div className="board">
                <div className="row">
                    <Square val={board[0]} chooseSquare={() => chooseSquare(0)} />
                    <Square val={board[1]} chooseSquare={() => chooseSquare(1)} />
                    <Square val={board[2]} chooseSquare={() => chooseSquare(2)} />
                </div>
                <div className="row">
                    <Square val={board[3]} chooseSquare={() => chooseSquare(3)} />
                    <Square val={board[4]} chooseSquare={() => chooseSquare(4)} />
                    <Square val={board[5]} chooseSquare={() => chooseSquare(5)} />
                </div>
                <div className="row">
                    <Square val={board[6]} chooseSquare={() => chooseSquare(6)} />
                    <Square val={board[7]} chooseSquare={() => chooseSquare(7)} />
                    <Square val={board[8]} chooseSquare={() => chooseSquare(8)} />
                </div>
            </div>
        </>
    );
}

export default TicTac;
