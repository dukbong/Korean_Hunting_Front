import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import './css/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const handleLogin = () => {
    // Jenkins에 대한 로그인 요청을 처리하는 함수
    // 예를 들어, axios 또는 fetch를 사용하여 API 호출할 수 있음
    console.log('Username:', username);
    console.log('Password:', password);
    // 이 곳에서 Jenkins에 대한 실제 로그인 요청을 보낼 수 있음
  };

  const handleSignup = () => {
    // 회원가입 페이지로 이동하는 함수
    console.log('Redirect to signup page');
    navigate('/signup'); // useHistory 대신 useNavigate 사용
    // 이 곳에서 회원가입 페이지로 이동하는 로직을 추가할 수 있음
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form>
        <div className="login-input">
          <label>사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-input">
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin} className="login-button">
          로그인
        </button>
        <button type="button" onClick={handleSignup} className="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Login;
