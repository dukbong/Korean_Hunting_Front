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
import Navigation from "./component/navigation";
import AdminUsers from "./component/admin";
import Footer from "./component/footer";
import OpenApi from "./component/openApi";

function App() {

  return (
      <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/info" element={<Info />} />
          <Route path="/use/api" element={<OpenApi />} />
          <Route path="/admin/get/users" element={<AdminUsers />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Footer/>
      </Router>
  );
}

export default App;
