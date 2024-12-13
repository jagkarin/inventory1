import logo from './logo.svg';
import { BrowserRouter as Router,Route,Routes,Link} from 'react-router-dom';
import './App.css';
import Inventory from './component/Inventory';
import RequestPage from './component/Request';


function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;
