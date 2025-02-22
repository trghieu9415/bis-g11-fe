import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

type Employee = {
	id: number;
	name: string;
	age: number;
};

interface HREmployeeTableProps {
	data?: Employee[];
}

export default function HREmployeeTable({ data = [] }: HREmployeeTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>STT</TableHead>
					<TableHead>Tên</TableHead>
					<TableHead>Tuổi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item, index) => (
					<TableRow key={item.id}>
						<TableCell>{index + 1}</TableCell>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.age}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
