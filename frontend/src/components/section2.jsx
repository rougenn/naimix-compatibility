import React, { useState } from 'react';
import './section2.css';
import ComponentOne from './ComponentOne';
import ComponentTwo from './ComponentTwo';
import ComponentThree from './ComponentThree';

const SectionTwo = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeComponent, setActiveComponent] = useState('one');

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'one':
                return <ComponentOne users={users} groups={groups} />;
            case 'two':
                return <ComponentTwo  users={users}
                groups={groups}
                setGroups={setGroups}
                />;
            case 'three':
                return <ComponentThree setUsers={setUsers} users={users}/>;
            default:
                return <div className="placeholder">Выберите опцию</div>;
        }
    };

    return (
        <div className="section-two">
            <div className="icon-buttons">
                <button className="icon-button" onClick={() => setActiveComponent('one')}>
                    <div className="circle-icon">
                        <img src="./public/assets/icon/list.png" alt="Icon 1" />
                    </div>
                </button>
                <button className="icon-button" onClick={() => setActiveComponent('two')}>
                    <div className="circle-icon">
                        <img src="./public/assets/icon/add_group.png" alt="Icon 2" />
                    </div>
                </button>
                <button className="icon-button" onClick={() => setActiveComponent('three')}>
                    <div className="circle-icon">
                        <img src="./public/assets/icon/Group_1.png" alt="Icon 3" />
                    </div>
                </button>
            </div>
            <div className={`side-panel ${activeComponent ? 'open' : ''}`}>
                {renderActiveComponent()}
            </div>
        </div>
    );
};

export default SectionTwo;
