export interface ApiResponse {
	statusCode: number;
	message?: string;
	data?: [];
}

export interface ScanResponse extends ApiResponse {
	statusCode: number;
	message?: string;
	data?: [];
}
