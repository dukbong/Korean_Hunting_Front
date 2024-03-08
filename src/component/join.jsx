import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import './css/signup.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignUp = () => {

    axios.post("/join", {
      userId: username,
      userPwd: password,
      email: email,
      company: company
    }).then((res) => {
      console.log(res.data);
      navigate('/login');
    }).catch((error) => {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    })

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
