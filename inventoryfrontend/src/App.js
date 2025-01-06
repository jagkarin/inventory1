import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MembersComponent from './component/Members/Members';
import Dashboard from './component/Dashboard/Dashboard';
import Inventory from './component/InventoryPage/Inventory';
import RequestPage from './component/RequestP/Request';
import ProductList from './component/InventoryPage/ProductList';
import Login from './component/Login/Login';
import Register from './component/Login/Register';
import ForgotPassword from './component/Login/ForgotPassword';
import Profile from './component/Login/Profile';

function App() {
  return (
    <Router>
      <div>
        {/* เมนูนำทาง */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">My App</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/members">Members</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forgot-password">Forgot Password</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/RequestPage">RequestPage</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ProductList">ProductList</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Inventory">Inventory</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes สำหรับเมนูที่เลือก */}
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/RequestPage" element={<RequestPage />} />
          <Route path="/ProductList" element={<ProductList />} />
          
          {/* คุณสามารถเพิ่มเส้นทางอื่นๆ ได้ที่นี่ */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;