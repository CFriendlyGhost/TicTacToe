import { useState } from "react";

function Message() {
  const [items, setItems] = useState(["X", "O", "X", "O", "", "", "", "", ""]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getInfo = () => {
    return items.length === 0 ? <h1>Empty List</h1> : null;
  };
  return (
    <>
      <ul className="list-group list-group-horizontal">
        {items.map(
          (item, index) =>
            index < 3 && (
              <li
                className={
                  selectedIndex === index
                    ? "list-group-item active"
                    : "list-group-item"
                }
                key={item}
                onClick={() => setItems(index)}
              >
                {item}
              </li>
            )
        )}
      </ul>
      <ul className="list-group list-group-horizontal">
        {items.map(
          (item, index) =>
            3 <= index &&
            index < 6 && (
              <li
                className={
                  selectedIndex === index
                    ? "list-group-item active"
                    : "list-group-item"
                }
                key={item}
                onClick={() => setSelectedIndex(index)}
              >
                {item}
              </li>
            )
        )}
      </ul>
      <ul className="list-group list-group-horizontal">
        {items.map(
          (item, index) =>
            6 <= index &&
            index < 9 && (
              <li
                className={
                  selectedIndex === index
                    ? "list-group-item active"
                    : "list-group-item"
                }
                key={item}
                onClick={() => setSelectedIndex(index)}
              >
                {item}
              </li>
            )
        )}
      </ul>
    </>
  );
}

export default Message;
