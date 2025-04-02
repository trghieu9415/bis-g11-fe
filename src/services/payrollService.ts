import axios from '@/services/customize-axios';

export const exportPayroll = async (id: number) => {
	try {
		const response = await axios.get(`/api/v1/payrolls/export/${id}`);
		console.log('Xuất bảng lương thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xuất bảng lương:', error);
		throw error;
	}
};

