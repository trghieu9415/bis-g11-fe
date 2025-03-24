import axios from 'axios';

interface LoginBody {
	username: string;
	password: string;
	platform: string;
}

export const loginAccount = async (body: LoginBody) => {
	try {
		const response = await axios.post('/api/v1/auth/access', body);
		return response.data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};
