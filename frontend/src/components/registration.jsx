import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosInstance';
import './registration.css';

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        second_name: '',
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
            navigate('/login'); 
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
                        name="first_name"
                        placeholder="Имя"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        name="second_name"
                        placeholder="Фамилия"
                        value={formData.second_name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        name="company_name"
                        placeholder="Компания"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="tel"
                        name="phone_number"
                        placeholder="Телефон (+7...)"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Почта"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль (минимум 8 символов)"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                        required
                        minLength="8"
                    />
                    <button type="submit" className="submit-button">отправить</button>
                </form>
                <hr className="line-bottom" />
            </div>
        </div>
    );
};

export default Registration;
