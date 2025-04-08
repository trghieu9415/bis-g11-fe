import axios from '@/services/customize-axios';

// export const updateSupplier = async (userId: number, userData: object) => {
// 	try {
// 		const response = await axios.put(`/api/v1/supplier/${userId}`, userData);
// 		console.log('Cập nhật thành công:', response);
// 		return response;
// 	} catch (error) {
// 		console.error('Lỗi khi cập nhật nhà cung cấp:', error);
// 		throw error;
// 	}
// };

// export const deleteSupllier = async (userId: number) => {
// 	try {
// 		const response = await axios.patch(`/api/v1/supplier/${userId}`);
// 		console.log('Xóa thành công:', response);
// 		return response;
// 	} catch (error) {
// 		console.error('Lỗi khi xóa nhà cung cấp:', error);
// 		throw error;
// 	}
// };

// export const addSupplier = async (data: object) => {
// 	try {
// 		const response = await axios.post('/api/v1/supplier/add', data, {
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		});
// 		console.log('Thêm thành công:', response);
// 		return response;
// 	} catch (error) {
// 		console.error('Lỗi khi thêm supplier:', error);
// 		throw error;
// 	}
// };
export const getAuthor = async (authorId: number) => {
	try {
		const response = await axios.get(`/api/v1/author/${authorId}`);
		return response.data;
	} catch (error) {
		console.error('Lỗi lấy author:', error);
		throw error;
	}
};
