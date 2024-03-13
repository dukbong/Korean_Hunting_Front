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
    if(!(username && password && email)){
      alert("필수 입력 사항을 모두 입력해주세요.");
      return;
    }
    
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

  const handleGoBack = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <div className="jenkins-signup-container">
      <h2 className="jenkins-signup-heading">Sign Up</h2>
      <form>
        <div className="jenkins-signup-input">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='아이디를 입력해주세요. [필수]'
          />
        </div>
        <div className="jenkins-signup-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='비밀번호를 입력해주세요. [필수]'
          />
        </div>
        <div className="jenkins-signup-input">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='이메일을 입력해주세요. [필수]'
          />
        </div>
        <div className="jenkins-signup-input">
          <input
            type="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder='회사를 입력해주세요.'
          />
        </div>
        <button type="button" onClick={handleSignUp} className="jenkins-signup-button">
          회원가입
        </button>
        <button type="button" onClick={handleGoBack} className="back-button">
          뒤로가기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
