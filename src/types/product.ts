export type Product = {
	id: number;
	value?: string;
	name: string;
	image: string;
	quantity: number;
	status: number;
	price: number;
	supplierId: number;
	categoryId: number;
	authorId: number;
	createdAt: string;
};

export type SelectedProduct = {
	id: number;
	name: string;
	price: number;
	quantity: number; // ✅ Số lượng muốn mua
	stock: number; // ✅ Tồn kho, lấy từ product.quantity
};
