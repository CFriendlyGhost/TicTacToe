namespace TicTacToe.Server.Hubs
{
    public class MoveInfo
    {
        public string[] Board { get; set; }
        public string Player { get; set; }

        public MoveInfo(string[] board, string player)
        {
            Board = board;
            Player = player;
        }
    }
}
