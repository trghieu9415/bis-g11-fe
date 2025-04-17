import axios from '@/services/customize-axios';

export const updateCategory = async (userId: number, userData: object) => {
	try {
		const response = await axios.put(`/api/v1/category/${userId}`, userData);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật danh mục:', error);
		throw error;
	}
};
export const deleteCategory = async (userId: number) => {
	try {
		const response = await axios.patch(`/api/v1/category/${userId}`);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật danh mục:', error);
		throw error;
	}
};
export const addCategory = async (data: object) => {
	try {
		const response = await axios.post('/api/v1/category/add', data, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm danh mục:', error);
		throw error;
	}
};
export const getCategory = async (categoryId: number) => {
	try {
		const response = await axios.get(`/api/v1/category/${categoryId}`);

		return response.data;
	} catch (error) {
		console.error('Lỗi lấy Category :', error);
		throw error;
	}
};
