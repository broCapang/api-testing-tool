// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/header/Header';
import AuthWrapper from './components/auth/authWrapper';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import AddTest from './pages/AddTest';
import RunTest from './pages/RunTest';
import Dashboard from './views/dashboard';

function App() {
    useEffect(() => {
        document.title = 'DataShield';
      }, []);
    
    return (
        
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <AuthWrapper>
                            <Dashboard />
                        </AuthWrapper>
                    } />
                    <Route path="/profile" element={
                        <AuthWrapper>
                            <Profile />
                        </AuthWrapper>
                    } />
                    <Route path="/addTest" element={
                        <AuthWrapper>
                            <AddTest />
                        </AuthWrapper>
                    } />
                    <Route path="/runTest" element={
                        <AuthWrapper>
                            <RunTest />
                        </AuthWrapper>
                    } />

                </Routes>
            </Router>

    );
}

export default App;
