// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/header/Header';
import AuthWrapper from './components/auth/authWrapper';

function App() {
    return (
        <body className="bg-gray-100 dark:bg-gray-900">
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <AuthWrapper>
                            <Home />
                        </AuthWrapper>
                    } />
                </Routes>
            </Router>
        </body>
    );
}

export default App;
