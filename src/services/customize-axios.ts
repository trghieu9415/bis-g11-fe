import axios from 'axios';

const instance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8085',
	timeout: 10000,
	headers: {
		Accept: '*/*',
		'Content-Type': 'application/json',
		Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
	}
});

instance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	response => {
		return response.data ? response.data : {};
	},
	error => {
		console.error('API Error:', error);
		return Promise.reject(error);
	}
);

export default instance;
