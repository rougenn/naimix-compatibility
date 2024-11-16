import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosInstance.jsx';
import Cookies from 'js-cookie';
import './registration.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', formData);

            
            Cookies.set('access_token', response.data.access_token, { expires: 0.0035 }); // 5 минут
            Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 }); // 7 дней

            navigate('/');
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || 'Ошибка авторизации. Проверьте введённые данные.'
            );
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h1>Login</h1>
                <hr className="line" />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="submit-button">войти</button>
                </form>
                <hr className="line-bottom" />
            </div>
        </div>
    );
};

export default Login;
