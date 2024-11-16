import React from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const Registration = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/'); 
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h1>create new account</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="фамилия" className="input-field" />
                    <input type="text" placeholder="имя" className="input-field" />
                    <input type="text" placeholder="компания" className="input-field" />
                    <input type="tel" placeholder="телефон" className="input-field" />
                    <input type="email" placeholder="почта" className="input-field" />
                    <input type="password" placeholder="пароль" className="input-field" />
                    <button type="submit" className="submit-button">отправить</button>
                </form>
                <hr className="line-bottom" />
            </div>
        </div>
    );
};

export default Registration;
