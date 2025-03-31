import axios from '@/services/customize-axios';

export const deleteHoliday = async (holidayID: number) => {
	try {
		const response = await axios.patch(`/api/v1/holidays/${holidayID}`);
		console.log('Xóa lịch nghỉ lễ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi hủy lịch nghỉ lễ:', error);
		throw error;
	}
};

export const updateHoliday = async (holidayID: number, holidayData: object) => {
	try {
		const response = await axios.put(`/api/v1/holidays/${holidayID}`, holidayData);
		console.log('Cập nhật lịch nghỉ lễ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật lịch nghỉ lễ:', error);
		throw error;
	}
};

export const addHoliday = async (holidayData: object) => {
	try {
		const response = await axios.post(`/api/v1/holidays`, holidayData);
		console.log('Thêm lịch nghỉ lễ thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm lịch nghỉ lễ:', error);
		throw error;
	}
};
