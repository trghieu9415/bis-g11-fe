export type ApiResponse<T> = {
	statusCode: number;
	success: boolean;
	message: string;
	data: T;
};
