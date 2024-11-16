import React, { useState } from 'react';
import './section3.css';

const Section3 = ({ users, groups }) => {
    const [isEmployeesPanelOpen, setIsEmployeesPanelOpen] = useState(false);
    const [isDepartmentsPanelOpen, setIsDepartmentsPanelOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const toggleEmployeesPanel = () => {
        setIsEmployeesPanelOpen(!isEmployeesPanelOpen);
        // Если открыта панель сотрудников, закрываем панель отделов
        if (isDepartmentsPanelOpen) {
            setIsDepartmentsPanelOpen(false);
        }
    };

    const toggleDepartmentsPanel = () => {
        setIsDepartmentsPanelOpen(!isDepartmentsPanelOpen);
        // Если открыта панель отделов, закрываем панель сотрудников
        if (isEmployeesPanelOpen) {
            setIsEmployeesPanelOpen(false);
        }
    };

    return (
        <div className="section-three">
            <div className="panels-container">
                {/* Панель "Работники" */}
                <div className="panel">
                    <button
                        className="panel-toggle"
                        onClick={toggleEmployeesPanel}
                    >
                        РАБОТНИКИ <span>{isEmployeesPanelOpen ? '▲' : '▼'}</span>
                    </button>
                    {isEmployeesPanelOpen && (
                        <div className="dropdown">
                            {users && users.length > 0 ? (
                                users.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`dropdown-item ${
                                            selectedUser === user
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        {user.name} - {user.status}
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">
                                    Нет доступных работников
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Панель "Отделы" */}
                <div className="panel">
                    <button
                        className="panel-toggle"
                        onClick={toggleDepartmentsPanel}
                    >
                        ОТДЕЛЫ <span>{isDepartmentsPanelOpen ? '▲' : '▼'}</span>
                    </button>
                    {isDepartmentsPanelOpen && (
                        <div className="dropdown">
                            {groups && groups.length > 0 ? (
                                groups.map((group, index) => (
                                    <div
                                        key={index}
                                        className={`dropdown-item ${
                                            selectedGroup === group
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => setSelectedGroup(group)}
                                    >
                                        {group.name}
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">Нет доступных отделов</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Информация о выбранных элементах */}
            <div className="info-panel">
                {selectedUser && (
                    <div className="info-item">
                        <h3>Выбранный работник:</h3>
                        <p>
                            {selectedUser.name} - {selectedUser.status}
                        </p>
                    </div>
                )}
                {selectedGroup && (
                    <div className="info-item">
                        <h3>Выбранный отдел:</h3>
                        <p>{selectedGroup.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Section3;
