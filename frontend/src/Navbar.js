import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultButton from "./Button";

function Navbar({ setIsLoggedIn }) {

    const navigate = useNavigate()

    const list = () => {
        navigate("/list")
    }

    const add = () => {
        navigate("/add")
    }

    const map = () => {
        navigate("/map")
    }

    const logout = () => {
        setIsLoggedIn(false)
        navigate("/")
    }

    return (
        <div className="navbar-parent">
            <nav className="navbar">
                <DefaultButton onClick={list} text={"List"} />
                <DefaultButton onClick={add} text={"Add"} />
                <DefaultButton onClick={map} text={"Map"} />
                <DefaultButton onClick={logout} text={"Logout"} />
            </nav>
        </div>
    );
}

export default Navbar;