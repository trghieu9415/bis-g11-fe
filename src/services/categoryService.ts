import axios from '@/services/customize-axios';

export const getCategory = async (categoryId: number) => {
	try {
		const response = await axios.get(`/api/v1/category/${categoryId}`);

		return response.data;
	} catch (error) {
		console.error('Lỗi lấy Category :', error);
		throw error;
	}
};
