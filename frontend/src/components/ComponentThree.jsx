import React, { useState, useEffect } from 'react';
import './ComponentThree.css';
import { getUsers, createUser, deleteUser } from './apiService';

const ComponentThree = () => {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [status, setStatus] = useState('worker');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        try {
            const newUser = await createUser({
                name: userName,
                birth_date: birthDate,
                birth_city: birthCity,
                birth_time: birthTime,
                status,
            });
            setUsers([...users, newUser]);
            setUserName('');
            setBirthDate('');
            setBirthCity('');
            setBirthTime('');
            setStatus('worker');
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter((user) => user.id !== userId));
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const handleSelectUser = (user) => {
        if (selectedUser && selectedUser.id === user.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
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
                    {users.map((user) => (
                        <li key={user.id}>
                            <span
                                className="user-name"
                                onClick={() => handleSelectUser(user)}
                            >
                                {user.name} - {user.status}
                            </span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteUser(user.id)}
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
                        <p>Дата рождения: {selectedUser.birth_date}</p>
                        <p>Город рождения: {selectedUser.birth_city}</p>
                        <p>Время рождения: {selectedUser.birth_time}</p>
                        <p>Статус: {selectedUser.status}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentThree;
