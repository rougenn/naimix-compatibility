import React from 'react';
import './ComponentOne.css';

const ComponentOne = ({ users, groups }) => {
    return (
        <div className="component-one">
            <div className="list-container">
                <h2>Список работников</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            {user.name} - <span className="user-status">{user.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="divider"></div>
            <div className="list-container">
                <h2>Список отделов</h2>
                <ul>
                    {groups.map((group, index) => (
                        <li key={index}>
                            <strong>{group.name}</strong>
                            <ul>
                                {group.users.map((user, i) => (
                                    <li key={i}>{user.name} - {user.status}</li>
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
