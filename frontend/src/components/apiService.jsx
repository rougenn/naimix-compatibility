import axios from './axiosInstance';

// Пользователи
export const getUsers = async () => {
    const response = await axios.get('/members');
    return response.data.members;
};

export const createUser = async (userData) => {
    const response = await axios.post('/member/create', userData);
    return response.data;
};

export const deleteUser = async (memberId) => {
    const response = await axios.post('/member/delete', { member_id: memberId });
    return response.data;
};

// Группы
export const getGroups = async () => {
    const response = await axios.get('/teams');
    return response.data.teams;
};

export const createGroup = async (groupData) => {
    const response = await axios.post('/team/create', groupData);
    return response.data;
};

export const deleteGroup = async (teamId) => {
    const response = await axios.post('/team/delete', { team_id: teamId });
    return response.data;
};

export const addMemberToGroup = async (teamId, memberId) => {
    const response = await axios.post('/team/add-member', {
        team_id: teamId,
        member_id: memberId,
    });
    return response.data;
};

export const removeMemberFromGroup = async (teamId, memberId) => {
    const response = await axios.post('/team/delete-member', {
        team_id: teamId,
        member_id: memberId,
    });
    return response.data;
};
