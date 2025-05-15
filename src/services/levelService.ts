import axios from '@/services/customize-axios';

export const updateLevel = async (levelID: number, levelData: object) => {
	try {
		const response = await axios.put(`/api/v1/seniorityLevels/${levelID}`, levelData);
		console.log('Cập nhật cấp bậc thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi cập nhật cấp bậc:', error);
		throw error;
	}
};

export const deleteLevel = async (levelID: number) => {
	try {
		const response = await axios.patch(`/api/v1/seniorityLevels/${levelID}`);
		console.log('Xóa cấp bậc thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi xóa cấp bậc:', error);
		throw error;
	}
};

export const addLevel = async (levelData: object) => {
	try {
		const response = await axios.post(`/api/v1/seniorityLevels`, levelData);
		console.log('Thêm cấp bậc thành công:', response);
		return response;
	} catch (error) {
		console.error('Lỗi khi thêm cấp bậc:', error);
		throw error;
	}
};
