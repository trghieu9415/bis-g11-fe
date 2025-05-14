import axios from '@/services/customize-axios';

export const updateSupplier = async (supplierId: number, supplierData: object) => {
	console.log(supplierData);
	try {
		const response = await axios.put(`/api/v1/supplier/${supplierId}`, supplierData);
		console.log('Cập nhật thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật nhà cung cấp:', error);
		throw error;
	}
};

export const deleteSupllier = async (userId: number) => {
	try {
		const response = await axios.patch(`/api/v1/supplier/${userId}`);
		console.log('Xóa thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xóa nhà cung cấp:', error);
		throw error;
	}
};

export const addSupplier = async (data: object) => {
	try {
		const response = await axios.post('/api/v1/supplier/add', data, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log('Thêm thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm supplier:', error);
		throw error;
	}
};
export const getSupplier = async (supplierId: number) => {
	try {
		const response = await axios.get(`/api/v1/supplier/${supplierId}`);

		return response.data;
	} catch (error) {
		console.error('Lỗi lấy supplier:', error);
		throw error;
	}
};

export const getListSuppliers = async () => await axios.get(`/api/v1/supplier/list`);
