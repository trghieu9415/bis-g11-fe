import axios from '@/services/customize-axios';
import { Product } from '@/types/product';

export const getListProducts = async () => await axios.get<Product[]>('/api/v1/product/list');

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
export const getProduct = async (productId: number) => {
	try {
		const response = await axios.get(`/api/v1/product/${productId}`);
		return response.data;
	} catch (error) {
		console.error('Lỗi lấy product:', error);
		throw error;
	}
};
