import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import axios from 'axios';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
