import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouteStack from "./routes";

function App() {
  return (
    <Router>
      <div className="App">
        <RouteStack />
      </div>
    </Router>
  );
}

export default App;
