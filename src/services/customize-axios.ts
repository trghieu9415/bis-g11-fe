import axios from 'axios';

const instance = axios.create({

	baseURL: "http://localhost:8080",

	timeout: 10000,
	headers: {
		Accept: '*/*',
		'Content-Type': 'application/json'
	}
});

instance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken');
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
