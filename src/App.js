import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login'; // 로그인 컴포넌트
import SignUp from './component/signup'; // 로그인 컴포넌트
import OtherPage from './component/otherPage'; // 다른 페이지 컴포넌트

function App() {

  const isAuthenticated = false;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={ isAuthenticated ? <OtherPage /> : <Navigate to="/login" /> } />
        <Route path="*" element={ <Navigate to="/login" /> } /> {/* 모든 경로를 처리하고, 로그인 페이지로 리디렉션 */}
      </Routes>
    </Router>
  );
}

export default App;
