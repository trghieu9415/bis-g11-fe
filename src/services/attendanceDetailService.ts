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
