// Mock data
const mockOrders: Order[] = [
	{
		id: '1',
		orderNumber: 'ORD001',
		orderDate: '2024-01-01T00:00:00Z',
		customerName: 'Nguyễn Văn A',
		customerPhone: '0123456789',
		customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
		totalAmount: 1500000,
		status: 'completed',
		products: [
			{
				id: '1',
				name: 'Sản phẩm A',
				quantity: 2,
				unitPrice: 500000,
				totalPrice: 1000000
			},
			{
				id: '2',
				name: 'Sản phẩm B',
				quantity: 1,
				unitPrice: 500000,
				totalPrice: 500000
			}
		],
		paymentMethod: 'bank_transfer',
		paymentStatus: 'completed',
		paymentDate: '2024-01-01T01:00:00Z',
		bankName: 'Vietcombank',
		bankAccount: '123456789',
		bankAccountName: 'NGUYEN VAN A',
		transferContent: 'ORD001'
	},
	{
		id: '2',
		orderNumber: 'ORD002',
		orderDate: '2024-01-02T00:00:00Z',
		customerName: 'Trần Thị B',
		customerPhone: '0987654321',
		customerAddress: '456 Đường XYZ, Quận 2, TP.HCM',
		totalAmount: 2000000,
		status: 'processing',
		products: [
			{
				id: '3',
				name: 'Sản phẩm C',
				quantity: 1,
				unitPrice: 2000000,
				totalPrice: 2000000
			}
		],
		paymentMethod: 'credit_card',
		paymentStatus: 'completed',
		paymentDate: '2024-01-02T01:00:00Z',
		transactionId: 'TXN123456',
		paymentGateway: 'VNPay'
	},
	{
		id: '3',
		orderNumber: 'ORD003',
		orderDate: '2024-01-03T00:00:00Z',
		customerName: 'Lê Văn C',
		customerPhone: '0369852147',
		customerAddress: '789 Đường DEF, Quận 3, TP.HCM',
		totalAmount: 3000000,
		status: 'pending',
		products: [
			{
				id: '4',
				name: 'Sản phẩm D',
				quantity: 3,
				unitPrice: 1000000,
				totalPrice: 3000000
			}
		],
		paymentMethod: 'cash',
		paymentStatus: 'pending'
	}
];
