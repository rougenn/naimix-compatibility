import React from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/'); 
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h1>login</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="почта" className="input-field" />
                    <input type="password" placeholder="пароль" className="input-field" />
                    <button type="submit" className="submit-button">отправить</button>
                </form>
                <hr className="line-bottom" />
            </div>
        </div>
    );
};

export default Login
