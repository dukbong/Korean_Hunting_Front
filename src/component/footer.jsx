import React from 'react';
import './css/footer.css';
import { useLocation } from "react-router-dom";

function Footer() {

    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const isJoinPage = location.pathname === "/join";
  
    // 로그인 상태 확인
    const isAuthenticated = !!localStorage.getItem("token");
    if (isAuthenticated && !isLoginPage && !isJoinPage) {
  return (
    <footer>
        <div className='footer'>
            <div className='languages'>Supported</div>
            <div className="marquee">
                <div>
                    <span>JSP</span>
                    <span>HTML</span>
                    <span>Python</span>
                    <span>C#</span>
                    <span>JavaScript</span>
                    <span>Java</span>
                </div>
            </div>
        </div>
    </footer>
  )
    }else {
        return null;
    }
}

export default Footer;