import React, { useState } from 'react';
import './ComponentTwo.css';

const ComponentTwo = ({ users, groups, setGroups }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSaveGroup = () => {
        const newGroup = { name: groupName, users: selectedUsers };
        if (editingIndex !== null) {
            const updatedGroups = [...groups];
            updatedGroups[editingIndex] = newGroup;
            setGroups(updatedGroups);
        } else {
            setGroups([...groups, newGroup]);
        }
        setGroupName('');
        setSelectedUsers([]);
        setEditingIndex(null);
    };

    const handleEditGroup = (index) => {
        setGroupName(groups[index].name);
        setSelectedUsers(groups[index].users);
        setEditingIndex(index);
    };

    const handleDeleteGroup = (index) => {
        const updatedGroups = groups.filter((_, i) => i !== index);
        setGroups(updatedGroups);
    };

    return (
        <div className="component-two">
            <div className="list-container">
                <h2>Добавить/Редактировать группу</h2>
                <input
                    type="text"
                    placeholder="Название группы"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="group-input"
                />
                <h3>Выбрать пользователей:</h3>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.some((u) => u.name === user.name)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers([...selectedUsers, user]);
                                        } else {
                                            setSelectedUsers(
                                                selectedUsers.filter((u) => u.name !== user.name)
                                            );
                                        }
                                    }}
                                />
                                {user.name}
                            </label>
                        </li>
                    ))}
                </ul>
                <button onClick={handleSaveGroup} className="save-button">
                    Сохранить группу
                </button>
            </div>
            <div className="divider"></div>
            <div className="list-container">
                <h2>Список групп</h2>
                <ul>
                    {groups.map((group, index) => (
                        <li key={index}>
                            <span>
                                <strong>{group.name}</strong>
                            </span>
                            <div className="group-actions">
                                <button
                                    className="edit-button"
                                    onClick={() => handleEditGroup(index)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteGroup(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ComponentTwo;
