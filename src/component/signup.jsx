import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import './css/signup.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const handleSignUp = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('company:', company);
    // 회원가입 로직 추가

    navigate('/login');
  };

  return (
    <div className="jenkins-signup-container">
      <h2 className="jenkins-signup-heading">Sign Up</h2>
      <form>
        <div className="jenkins-signup-input">
          <label>사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="jenkins-signup-input">
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="jenkins-signup-input">
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="jenkins-signup-input">
          <label>회사명:</label>
          <input
            type="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSignUp} className="jenkins-signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
