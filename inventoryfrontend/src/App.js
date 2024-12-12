import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import MembersComponent from './component/Members/Members';
import Dashboard from './component/Dashboard/Dashboard';

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
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes สำหรับเมนูที่เลือก */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;