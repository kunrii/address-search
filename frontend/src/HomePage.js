import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DefaultButton from "./Button";

function HomePage({ setIsLoggedIn }) {

    const navigate = useNavigate()

    const [callbackInvoked, setCallbackInvoked] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [validRenderUsername, setValidRenderUsername] = useState(true)
    const [validRenderPassword, setValidRenderPassword] = useState(true)

    const formInvalidClass = "invalid-input"

    useEffect(() => {
        if (callbackInvoked) {
            setIsLoggedIn(true)
            navigate("/list")
        }
    }, [callbackInvoked]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setValidRenderUsername(event.target.value.trim() !== "")
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setValidRenderPassword(event.target.value.trim() !== "")
    };

    const login = () => {

        //debug only...
        // if (username === "" && password === "") {
        //     setUsername("root")
        //     setPassword("root")
        // }

        const basiccredentials = `${username}:${password}`
        const encodedCredentials = btoa(basiccredentials)
        const headerString = "basic " + encodedCredentials

        var header = new Headers();
        header.append("Authorization", headerString);

        var requestOptions = {
            method: 'GET',
            headers: header,
            credentials: "include"
        };

        fetch('http://localhost:5000/api/login', requestOptions).then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error("Bad request " + response.status)
            }
        }).then(data => {
            localStorage.setItem("headerString", headerString)
            setCallbackInvoked(true)
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="center-container">
            <div className="centered-box">
                <form className="form">
                    <div className="home-page">Welcome!</div>
                    <input className={`input-div ${!validRenderUsername && formInvalidClass}`} placeholder="Username" type="text" value={username} onChange={handleUsernameChange} />
                    <br />
                    <input className={`input-div ${!validRenderPassword && formInvalidClass}`} placeholder="Password" type="text" value={password} onChange={handlePasswordChange} />
                    <DefaultButton onClick={login} text={"Login"} />
                </form>
            </div>
        </div >
    );
}

export default HomePage;