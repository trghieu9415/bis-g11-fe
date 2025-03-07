import axios from '@/services/customize-axios';

export const updateUser = async (userId: number, userData: object) => {
	try {
		const response = await axios.put(`/api/v1/users/${userId}`, userData);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật user:', error);
		throw error;
	}
};

export const deleteUser = async (userId: number) => {
	try {
		const response = await axios.patch(`/api/v1/users/${userId}`);
		console.log('Xóa thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xóa user:', error);
		throw error;
	}
};

export const addUser = async (userData: object) => {
	try {
		const response = await axios.post(`/api/v1/users`, userData);
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm user:', error);
		throw error;
	}
};
