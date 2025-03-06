import axios from '@/services/customize-axios';

export const updateUser = async (userId: number, userData: object) => {
	try {
		const response = await axios.put(`/users/${userId}`, userData);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật user:', error);
		throw error;
	}
};
