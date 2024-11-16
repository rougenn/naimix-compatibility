import React, { useEffect, useState } from 'react';
import './ComponentOne.css';
import { getUsers, getGroups } from './apiService';

const ComponentOne = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUsers = await getUsers();
                const fetchedGroups = await getGroups();
                setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
                setGroups(Array.isArray(fetchedGroups) ? fetchedGroups : []);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="component-one">
            <div className="list-container">
                <h2>Список работников</h2>
                <ul>
                    {Array.isArray(users) && users.map((user) => (
                        <li key={user.id}>
                            {user.name} - <span className="user-status">{user.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="divider"></div>
            <div className="list-container">
                <h2>Список отделов</h2>
                <ul>
                    {Array.isArray(groups) && groups.map((group) => (
                        <li key={group.id}>
                            <strong>{group.name}</strong>
                            <ul>
                                {Array.isArray(group.users) && group.users.map((user) => (
                                    <li key={user.id}>
                                        {user.name} - {user.status}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ComponentOne;
