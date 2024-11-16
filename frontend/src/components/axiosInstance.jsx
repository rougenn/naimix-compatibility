import axios from 'axios';
import Cookies from 'js-cookie';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8090', // Адрес вашего бэкенда
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.request.use((config) => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                
                const refreshToken = Cookies.get('refresh_token');
                if (!refreshToken) {
                    throw new Error('Отсутствует refresh_token');
                }

                
                const refreshResponse = await axios.post('http://localhost:8090/user/refresh-token', {
                    refresh_token: refreshToken,
                });

                // Сохраняем новый access_token
                Cookies.set('access_token', refreshResponse.data.access_token, { expires: 0.0035 });

                // Повторяем оригинальный запрос с новым токеном
                originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Ошибка обновления токена:', refreshError);
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = '/login'; // Перенаправляем пользователя на страницу логина
            }
        }

        // Если ошибка не связана с токенами, возвращаем её дальше
        return Promise.reject(error);
    }
);

export default axiosInstance;
