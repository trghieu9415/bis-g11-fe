import axios from '@/services/customize-axios';

export const updateRole = async (roleID: number, roleData: object) => {
	try {
		const response = await axios.put(`/api/v1/roles/${roleID}`, roleData);
		console.log('Cập nhật cấp bậc thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật cấp bậc:', error);
		throw error;
	}
};
