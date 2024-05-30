import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const handleLogout = () => {
  window.location.href = "/?code=logout";
};

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route path="/health">
          <h3>Healthy</h3>
        </Route>
        <Route path="/">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <App />
        </Route>
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
