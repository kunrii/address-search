import './frontend.css';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import { useEffect, useState } from 'react';

function App() {

    const [logginToken, setLogginToken] = useState(localStorage.getItem("loggin_token"))

    useEffect(() => {
        setLogginToken(localStorage.getItem("loggin_token"))
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                {/* <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Reacteeeeeeeeeee
                </a> */}
                {logginToken ? <HomePage/> : <LoginPage/>}
            </header>
        </div>
    );
}

export default App;
