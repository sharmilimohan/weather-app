import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherApp from "./compounds/Weather";
import "./App.css";

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}> 
      <Routes>
        <Route path="/" element={<WeatherApp />} />
      </Routes>
    </Router>
  );
};

export default App;
