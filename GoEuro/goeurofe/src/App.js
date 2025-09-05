import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";  // ✅ BrowserRouter 뺌
import WelcomeScreen from "./Components/WelcomeScreen";
import MyroCalendar from "./Components/MyroCalendar";
import LoginInMockup from "./Components/LoginInMockup";
import ModalCalendar from "./Components/ModalCalendar";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/myrocalendar" element={<MyroCalendar />} />
        <Route path="/loginmockup" element={<LoginInMockup />} />
        <Route path="/modalcalendar" element={<ModalCalendar/>} />
      </Routes>
    </div>
  );
}

export default App;
