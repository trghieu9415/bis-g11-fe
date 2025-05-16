import axios from '@/services/customize-axios';
interface LoginBody {
	username: string;
	password: string;
	platform: string;
}

interface FormResetPassword {
	secretKey: string;
	password: string;
	confirmPassword: string;
}

export const loginAccount = async (body: LoginBody) => axios.post('/api/v1/auth/access', body);

export const forgotPassword = async (body: { email: string }) => axios.post('/api/v1/auth/forgot-password', body);

export const resetPassword = async (body: FormResetPassword) => axios.post('/api/v1/auth/reset-password', body);
