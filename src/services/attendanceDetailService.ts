import axios from '@/services/customize-axios';

export const checkIn = async (checkInData: object) => {
	try {
		const response = await axios.post(`/api/v1/checkIn`, checkInData);
		console.log('Check in thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi check in:', error);
		throw error;
	}
};

export const checkOut = async (checkOutData: object) => {
	try {
		const response = await axios.put(`/api/v1/checkOut`, checkOutData);
		console.log('Check out thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi check out:', error);
		throw error;
	}
};

export const updateAttendanceDetail = async (attendanceDetail: object) => {
	try {
		const response = await axios.put(`/api/v1/attendanceDetails/update`, attendanceDetail);
		console.log('Cập nhật attendance detail thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật attendance detail:', error);
		throw error;
	}
};

export const getAllAttendanceDetailByDate = async (date: string) => {
	try {
		const response = await axios.get(`/api/v1/attendanceDetails/date?date=${date}`);
		console.log('Lấy danh sách attendance detail thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi lấy danh sách attendance detail:', error);
		throw error;
	}
};

export const getAllAttendanceDetailByUser = async (userId: number) => {
	try {
		const response = await axios.get(`/api/v1/attendanceDetails/user/${userId}`);
		console.log('Lấy danh sách chấm công của nhân viên thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi lấy danh sách chấm công của nhân viên:', error);
		throw error;
	}
};

export const scanAttendanceDetail = async () => {
	try {
		// Create current LocalDateTime in Java format (YYYY-MM-DDTHH:mm:ss)
		const currentDateTime = new Date().toISOString().slice(0, 19);
		const response = await axios.put(`/api/v1/scan?dateScan=${currentDateTime}`);
		console.log('Scan ngày chấm công của nhân viên thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi scan ngày chấm công của nhân viên:', error);
		throw error;
	}
};
