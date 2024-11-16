import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosInstance.jsx';
import './registration.css';

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        second_name: '',
        first_name: '',
        company_name: '',
        phone_number: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/signup', formData);
            navigate('/login'); // Переход на страницу логина
        } catch (error) {
            console.error('Ошибка регистрации:', error.response?.data?.error || error.message);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h1>create new account</h1>
                <hr className="line" />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="surname"
                        placeholder="фамилия"
                        value={formData.surname}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="имя"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="компания"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="телефон"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="почта"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">отправить</button>
                </form>
                <hr className="line-bottom" />
            </div>
        </div>
    );
};

export default Registration;
