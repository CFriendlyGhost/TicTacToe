using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using TicTacToe.Server.Hubs;
using System.Runtime.InteropServices;
using static System.Reflection.Metadata.BlobBuilder;

namespace TicTacToe.Server.Controllers
{
    public class ChatHub : Hub
    {

        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;

        public ChatHub(IDictionary<string, UserConnection> connections)
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
            }

        }


        public Task SendUsersConnected(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User);

            return Clients.Group(room).SendAsync("UsersInRoom", users, room);
        }
    }
}
