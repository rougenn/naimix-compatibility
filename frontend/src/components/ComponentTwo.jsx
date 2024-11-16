import React, { useState, useEffect } from 'react';
import './ComponentTwo.css';
import { getGroups, createGroup, deleteGroup, addMemberToGroup, removeMemberFromGroup } from './apiService';

const ComponentTwo = ({ users }) => {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editingGroupId, setEditingGroupId] = useState(null);

    useEffect(() => {
        const fetchGroups = async () => {
            const groupData = await getGroups();
            setGroups(groupData);
        };
        fetchGroups();
    }, []);

    const handleSaveGroup = async () => {
        if (editingGroupId) {
            const groupToEdit = groups.find((group) => group.id === editingGroupId);

            const usersToAdd = selectedUsers.filter(
                (user) => !groupToEdit.users.some((groupUser) => groupUser.id === user.id)
            );

            const usersToRemove = groupToEdit.users.filter(
                (groupUser) => !selectedUsers.some((user) => user.id === groupUser.id)
            );

            await Promise.all(
                usersToAdd.map((user) => addMemberToGroup(editingGroupId, user.id))
            );

            await Promise.all(
                usersToRemove.map((user) => removeMemberFromGroup(editingGroupId, user.id))
            );

            const updatedGroups = groups.map((group) =>
                group.id === editingGroupId
                    ? { ...group, name: groupName, users: selectedUsers }
                    : group
            );

            setGroups(updatedGroups);
        } else {
            const newGroup = await createGroup({ name: groupName });
            await Promise.all(
                selectedUsers.map((user) => addMemberToGroup(newGroup.id, user.id))
            );
            setGroups([...groups, { ...newGroup, users: selectedUsers }]);
        }

        setGroupName('');
        setSelectedUsers([]);
        setEditingGroupId(null);
    };

    const handleEditGroup = (groupId) => {
        const group = groups.find((g) => g.id === groupId);
        setGroupName(group.name);
        setSelectedUsers(group.users);
        setEditingGroupId(groupId);
    };

    const handleDeleteGroup = async (groupId) => {
        await deleteGroup(groupId);
        setGroups(groups.filter((group) => group.id !== groupId));
    };

    const toggleUserSelection = (user) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.some((u) => u.id === user.id)
                ? prevSelected.filter((u) => u.id !== user.id)
                : [...prevSelected, user]
        );
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
                    {users.map((user) => (
                        <li key={user.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.some((u) => u.id === user.id)}
                                    onChange={() => toggleUserSelection(user)}
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
                    {groups.map((group) => (
                        <li key={group.id}>
                            <span>
                                <strong>{group.name}</strong>
                            </span>
                            <div className="group-actions">
                                <button
                                    className="edit-button"
                                    onClick={() => handleEditGroup(group.id)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteGroup(group.id)}
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
