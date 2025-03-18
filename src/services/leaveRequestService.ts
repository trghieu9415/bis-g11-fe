import axios from '@/services/customize-axios';

export const addLeaveRequest = async (leaveReqObject: object) => {
	try {
		const response = await axios.post(`/api/v1/leaveReqs`, leaveReqObject);
		console.log('Thêm đơn nghỉ phép thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm đơn nghỉ phép:', error);
		throw error;
	}
};

export const deleteLeaveRequest = async (leaveRequestID: number) => {
	try {
		const response = await axios.patch(`/api/v1/leaveReqs/${leaveRequestID}`);
		console.log('Hủy đơn nghỉ phép thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi hủy đơn nghỉ phép:', error);
		throw error;
	}
};

export const approveLeaveRequest = async (leaveRequestID: number) => {
	try {
		const response = await axios.patch(`/api/v1/leaveReqs/approve/${leaveRequestID}`);
		console.log('Duyệt đơn nghỉ phép thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi duyệt đơn nghỉ phép:', error);
		throw error;
	}
};

export const rejectLeaveRequest = async (leaveRequestID: number) => {
	try {
		const response = await axios.patch(`/api/v1/leaveReqs/reject/${leaveRequestID}`);
		console.log('Từ chối đơn nghỉ phép thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi từ chối đơn nghỉ phép:', error);
		throw error;
	}
};
