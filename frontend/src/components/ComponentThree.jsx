import React, { useState, useEffect } from 'react';
import './ComponentThree.css';
import { getUsers, createUser, deleteUser } from './apiService';

const ComponentThree = () => {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [role, setRole] = useState('worker'); // Заменено на role для соответствия серверу
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []); // Проверяем, что данные — это массив
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (!userName.trim() || !birthDate || !birthCity.trim() || !birthTime.trim()) {
            alert('Пожалуйста, заполните все поля перед добавлением пользователя.');
            return;
        }

        // Преобразование даты и времени в Unix timestamp
        const birthDateTime = new Date(`${birthDate}T${birthTime}`);
        const timestamp = Math.floor(birthDateTime.getTime() / 1000);

        try {
            const newUser = await createUser({
                role, // Используем роль вместо статуса
                birthday_info: {
                    birthday_timestamp: timestamp,
                    birthday_location: birthCity,
                },
            });

            if (newUser?.id) {
                setUsers((prevUsers) => [...prevUsers, newUser]);
                setUserName('');
                setBirthDate('');
                setBirthCity('');
                setBirthTime('');
                setRole('worker');
            } else {
                console.error('Ошибка создания пользователя: данные пользователя отсутствуют.');
            }
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(null); // Убираем выделенного пользователя, если он удалён
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser((prevSelected) =>
            prevSelected && prevSelected.id === user.id ? null : user
        );
    };

    return (
        <div className="component-three">
            <div className="list-container">
                <h2>Добавить нового участника</h2>
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
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-field"
                >
                    <option value="worker">Работник</option>
                    <option value="manager">Начальник</option>
                </select>
                <button onClick={handleAddUser} className="save-button">
                    Сохранить участника
                </button>
            </div>
            <div className="divider"></div>
            <div className="list-container">
                <h2>Список участников</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <span
                                className="user-name"
                                onClick={() => handleSelectUser(user)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleSelectUser(user);
                                }}
                            >
                                {user.name} - {user.role}
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
                        <h3>Информация об участнике</h3>
                        <p>Имя: {selectedUser.name}</p>
                        <p>Дата рождения: {new Date(selectedUser.birthday_info.birthday_timestamp * 1000).toLocaleDateString()}</p>
                        <p>Город рождения: {selectedUser.birthday_info.birthday_location}</p>
                        <p>Роль: {selectedUser.role}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentThree;
