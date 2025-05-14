import axios from '@/services/customize-axios';

export const updateRole = async (roleID: number, roleData: object) => {
	try {
		const response = await axios.put(`/api/v1/roles/${roleID}`, roleData);
		console.log('Cập nhật chức vụ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật chức vụ:', error);
		throw error;
	}
};

export const addRole = async (roleData: object) => {
	try {
		const response = await axios.post(`/api/v1/roles`, roleData);
		console.log('Thêm chức vụ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm chức vụ:', error);
		throw error;
	}
};

export const deleteRole = async (roleId: number) => {
	try {
		const response = await axios.patch(`/api/v1/roles/${roleId}`);
		console.log('Xóa chức vụ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xóa chức vụ:', error);
		throw error;
	}
};
