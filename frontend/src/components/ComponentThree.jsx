import React, { useState } from 'react';
import './ComponentThree.css';

const ComponentThree = ({ setUsers, users }) => {
    const [userName, setUserName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [status, setStatus] = useState('worker');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleAddUser = () => {
        const newUser = {
            name: userName,
            birthDate,
            birthCity,
            birthTime,
            status,
        };
        setUsers([...users, newUser]);
        setUserName('');
        setBirthDate('');
        setBirthCity('');
        setBirthTime('');
        setStatus('worker');
    };

    const handleSelectUser = (user) => {
        if (selectedUser === user) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
        }
    };

    const handleDeleteUser = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        if (selectedUser && users[index] === selectedUser) {
            setSelectedUser(null);
        }
    };

    return (
        <div className="component-three">
            <div className="list-container">
                <h2>Добавить нового работника</h2>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Город рождения"
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="input-field"
                />
                <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="input-field"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-field"
                >
                    <option value="worker">Работник</option>
                    <option value="manager">Начальник</option>
                </select>
                <button onClick={handleAddUser} className="save-button">
                    Сохранить пользователя
                </button>
            </div>
            <div className="divider"></div>
            <div className="list-container">
                <h2>Список пользователей</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <span
                                className="user-name"
                                onClick={() => handleSelectUser(user)}
                            >
                                {user.name} - {user.status}
                            </span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteUser(index)}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
                {selectedUser && (
                    <div className="user-details">
                        <h3>Информация о пользователе</h3>
                        <p>Имя: {selectedUser.name}</p>
                        <p>Дата рождения: {selectedUser.birthDate}</p>
                        <p>Город рождения: {selectedUser.birthCity}</p>
                        <p>Время рождения: {selectedUser.birthTime}</p>
                        <p>Статус: {selectedUser.status}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentThree;
