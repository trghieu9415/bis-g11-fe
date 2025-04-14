import axios from '@/services/customize-axios';

export const updateAuthor = async (userId: number, userData: object) => {
	try {
		const response = await axios.put(`/api/v1/author/${userId}`, userData);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật tác giả:', error);
		throw error;
	}
};
// export const deleteAuthor = async (userId: number) => {
// 	try {
// 		const response = await axios.patch(`/api/v1/author/${userId}`);
// 		console.log('Cập nhật thành công:', response);
// 		return response;
// 	} catch (error) {
// 		console.error('Lỗi khi cập nhật tác giả:', error);
// 		throw error;
// 	}
// };
export const addAuthor = async (data: object) => {
	try {
		const response = await axios.post('/api/v1/author/add', data, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm tác giả:', error);
		throw error;
	}
};
export const getAuthor = async (authorId: number) => {
	try {
		const response = await axios.get(`/api/v1/author/${authorId}`);
		return response.data;
	} catch (error) {
		console.error('Lỗi lấy author:', error);
		throw error;
	}
};
