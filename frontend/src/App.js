import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/login';
import Home from './pages/home';
import Header from './component/header/Header';

function App() {
  return (
    
    <body class="bg-gray-100 dark:bg-gray-900">
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
      
    </body>
    
  );
}

export default App;
