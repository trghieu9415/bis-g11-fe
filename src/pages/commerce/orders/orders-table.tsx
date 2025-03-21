import CustomTable from '@/components/custom-table';
import { ColumnDef } from '@tanstack/react-table';

type Order = {
	id: number;
	customer: string;
	orderDate: Date;
	total: number;
	status: string;
};

const columns: ColumnDef<Order>[] = [];

export default function OrdersTable() {
	return (
		<div>
			<div></div>
		</div>
	);
}
