import "./App.css";
import React, { } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./component/login"; // 로그인 컴포넌트
import SignUp from "./component/join"; // 로그인 컴포넌트
import Info from "./component/info"; // 다른 페이지 컴포넌트
import Dashboard from "./component/dashboard"; // 다른 페이지 컴포넌트
import Navigation from './component/navigation';
import { UserProvider } from './component/userContext';

function App() {

  return (
    <UserProvider>
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
