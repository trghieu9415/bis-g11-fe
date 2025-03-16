import axios from '@/services/customize-axios';

export const updateContract = async (idContract: number, contractData: object) => {
	try {
		const response = await axios.put(`/api/v1/contracts/${idContract}`, contractData);
		console.log('Cập nhật hợp đồng phép thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật hợp đồng phép:', error);
		throw error;
	}
};
