import axios from '@/services/customize-axios';

export const addGoodsReceipt = async (data: object) => {
	try {
		const response = await axios.post('api/v1/good-receipt/create', data);
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm goodsReceipt:', error);
		throw error;
	}
};
