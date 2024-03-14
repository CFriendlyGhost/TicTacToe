import { useState } from "react";

function Lobby({ joinRoom }) {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();

  return (
    <div className="lobby">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="name"
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="room"
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-success"
        onClick={(e) => {
          e.preventDefault();
          joinRoom(user, room);
        }}
        disabled={!user || !room}
      >
        Join
      </button>
    </div>
  );
}

export default Lobby;
