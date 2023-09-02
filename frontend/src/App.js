import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';
import AddPage from './AddPage';
import MapPage from './MapPage';
import Navbar from './Navbar';
import './frontend.css';
import { useState } from 'react';
import HomePage from './HomePage';

function App() {

    // useEffect(() => {
    //     localStorage.setItem("username", "root")
    //     localStorage.setItem("password", "root")
    // }, [])

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [isListEnabled, setIsListEnabled] = useState(false);

    return (
        <Router className="app">
            {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
            <Routes>
                <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/add" element={<AddPage isLoggedIn={isLoggedIn} />} />
                <Route path="/map" element={<MapPage isLoggedIn={isLoggedIn} />} />
                <Route path="/list" element={<ListPage isLoggedIn={isLoggedIn} />} />
            </Routes>
        </Router>
    );
}

export default App;
