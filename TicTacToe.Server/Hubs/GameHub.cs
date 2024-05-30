using Microsoft.AspNetCore.SignalR;
using TicTacToe.Server.Hubs;
using Microsoft.AspNetCore.Authorization;

namespace TicTacToe.Server.Controllers
{
    [Authorize]
    public class GameHub : Hub
    {

        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;

        public GameHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "MyChat Bot";
            _connections = connections;
        }


        public async Task JoinRoom(UserConnection userConnection)
        {
            var numberOfUsersInRoom = _connections.Count(con => con.Value.Room.Equals(userConnection.Room));
            
            if (numberOfUsersInRoom == 1) {
                userConnection.UserSymbol = "O";
            }
            else if (numberOfUsersInRoom > 1)
            {
                await Clients.Caller.SendAsync("JoinRoomResponse", false, "Room is full");
                return;
            }
            else
            {
                userConnection.UserSymbol = "X";
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _connections[Context.ConnectionId] = userConnection;
            await SendUsersConnected(userConnection.Room);
            await Clients.Caller.SendAsync("JoinRoomResponse", true, "Joined room successfully");
            await Clients.Client(Context.ConnectionId).SendAsync("Symbol", userConnection.UserSymbol);

        }
            
        public async Task MakeMove(MoveInfo moveInfo)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                var roomConnections = _connections.Values.Where(c => c.Room == userConnection.Room);

                if (userConnection.UserSymbol == moveInfo.Player)
                {
                    await Clients.Group(userConnection.Room).SendAsync("ReceiveMove", userConnection.User, moveInfo);

                    string nextPlayer = userConnection.UserSymbol == "X" ? "O" : "X";
                    await Clients.Group(userConnection.Room).SendAsync("NextPlayer", nextPlayer);
                }

                if (roomConnections.Any())
                {
                    foreach (var connection in roomConnections)
                    {
                        await Clients.Group(connection.Room).SendAsync("UpdateBoard", moveInfo.Board, moveInfo.Player);
                    }
                }

                if (CheckPattern(moveInfo.Board, moveInfo.Player))
                {
                    await Clients.Group(userConnection.Room).SendAsync("GameResult", $"The user with {moveInfo.Player} won the game!");
                    foreach (var connection in _connections.Where(kv => kv.Value.Room == userConnection.Room).ToList())
                    {
                        _connections.Remove(connection.Key);
                    }

                    return;
                }
            }
        }

        public Task SendUsersConnected(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User);

            return Clients.Group(room).SendAsync("UsersInRoom", users, room);
        }

        public static bool CheckPattern(string[] board, string symbol)
        {
            List<List<int>> patterns = new List<List<int>>
            {
            new () { 0, 1, 2 },
            new () { 3, 4, 5 },
            new () { 6, 7, 8 },
            new () { 0, 3, 6 },
            new () { 1, 4, 7 },
            new () { 2, 5, 8 },
            new () { 0, 4, 8 },
            new () { 2, 4, 6 }
            };

            var choosenIndexes = new List<int>();

            for (int i = 0; i < board.Length; i++)
            {
                if (board[i] == symbol)
                {
                    choosenIndexes.Add(i);
                }
            }


            foreach (var pattern in patterns)
            {
                var i = 0;
                var j = 0;
                while (j < choosenIndexes.Count)
                {
                    if (choosenIndexes[j] == pattern[i])
                    {
                        i++;
                        j++;
                        if (i == pattern.Count)
                        {
                            return true;
                        }
                    }
                    else
                    {
                        if (i > 0)
                        {
                            i = 0;
                        }
                        j++;
                    }
                }
            }

            return false;
        }
    }
}
