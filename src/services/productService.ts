import axios from '@/services/customize-axios';

export const updateProduct = async (userId: number, data: object) => {
	try {
		const response = await axios.put(`/api/v1/product/${userId}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật sản phẩm:', error);
		throw error;
	}
};

export const deleteProduct = async (productId: number) => {
	try {
		const response = await axios.patch(`/api/v1/product/${productId}`);
		console.log('Xóa thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xóa sản phẩm:', error);
		throw error;
	}
};

export const addProduct = async (data: object) => {
	try {
		const response = await axios.post('/api/v1/product/add', data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm product:', error);
		throw error;
	}
};
