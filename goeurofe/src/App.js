// src/App.js
import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./Components/WelcomeScreen";
import MyroCalendar from "./Components/MyroCalendar";
import LoginInMockup from "./Components/LoginInMockup";
import LoginScreen from "./Components/LoginScreen";
import DayPlan from "./Components/DayPlan"
import Form from "./Components/Form"
import HomeLanding from "./Components/HomeLanding";
import SelectBtn from "./Components/SelectBtn";
import Trippurpose from "./Components/TripPuropose";
import TemaPlan from "./Components/TemaPlan";
import ModePlan from "./Components/ModePlan";
import OutputPage from "./Components/OutputPage";
import ResultPage from "./Components/ResultPage";
import ResultPage1 from "./Components/ResultPage1";
import ResultPage2 from "./Components/ResultPage2";
import Profile from "./Components/Profile";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/myrocalendar" element={<MyroCalendar />} />
        <Route path="/main1" element={<LoginInMockup />} />
        <Route path="/loginscreen" element={<LoginScreen />} />
        <Route path="/dayplanscreen" element={<DayPlan/>} />
        <Route path="/main2" element={<HomeLanding/>} />
        <Route path="/main4" element={<Trippurpose/>} />
        <Route path="/main3" element={<SelectBtn/>} />
        <Route path="/form" element={<Form/>} />
        <Route path="/main6" element={<TemaPlan/>} />
        <Route path="/main5" element={<ModePlan/>} />
        <Route path="/outputpage" element={<OutputPage/>} />
        <Route path="/resultpage" element={<ResultPage/>} />
          <Route path="/resultpage1" element={<ResultPage1/>} />
           <Route path="/resultpage2" element={<ResultPage2/>} />
          
        <Route path="/profile" element={<Profile/>} />
        {/* 없는 경로 처리 (선택) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
