import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CircleCheckBig, Ban, UserRoundPen } from 'lucide-react';

type Employee = {
	id: string;
	full_name: string;
	role: string;
	status: boolean;
	basic_salary: number;
	level: string;
	salary_coefficient: number;
	gender: boolean;
	email: string;
	phone: string;
	date_of_birth: string;
	address: string;
};

export const columns: ColumnDef<Employee>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white w-16'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				ID <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'full_name',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white w-40'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Tên <ArrowUpDown />
			</Button>
		),
		cell: ({ row }) => (
			<span className='flex items-center'>
				<Button variant='ghost' className='text-black p-1 h-5 mr-2'>
					<UserRoundPen />
				</Button>
				{row.getValue('full_name')}
			</span>
		)
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white w-40'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Vai trò <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'status',
		header: 'Trạng thái',
		cell: ({ row }) => (
			<span className='flex justify-center'>
				{row.getValue('status') ? (
					<CircleCheckBig color='#31843f' strokeWidth={3} />
				) : (
					<Ban color='#ef5350' strokeWidth={3} />
				)}
			</span>
		)
	},
	{
		accessorKey: 'basic_salary',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Lương cơ bản <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'level',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Kinh nghiệm <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'salary_coefficient',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Hệ số lương <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'gender',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Giới tính <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white w-52'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Email <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'phone',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Số điện thoại <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'date_of_birth',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Ngày sinh <ArrowUpDown />
			</Button>
		)
	},
	{
		accessorKey: 'address',
		header: ({ column }) => (
			<Button
				variant='link'
				className='text-white w-72'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Địa chỉ <ArrowUpDown />
			</Button>
		)
	}
];

const employees: Employee[] = Array.from({ length: 24 }, (_, index) => {
	const id = `NV-${(index + 1).toString().padStart(4, '0')}`;
	const fullNames = [
		'Nguyễn Văn A',
		'Trần Thị B',
		'Lê Quốc C',
		'Phạm Minh D',
		'Hoàng Anh E',
		'Đặng Văn F',
		'Lương Thị G',
		'Vũ Minh H',
		'Trịnh Hoài I',
		'Lý Phương K',
		'Bùi Thanh L',
		'Ngô Hữu M',
		'Tô Nhật N',
		'Đào Văn O',
		'Lâm Thị P',
		'Trần Đức Q',
		'Nguyễn Hồng R',
		'Lý Bảo S',
		'Đinh Hoàng T',
		'Võ Minh U',
		'Phan Hữu V',
		'Mai Thanh X',
		'Hà Quốc Y',
		'Dương Thị Z'
	];
	const roles = [
		'Software Engineer',
		'HR Manager',
		'Product Manager',
		'UI/UX Designer',
		'DevOps Engineer',
		'Business Analyst',
		'Marketing Specialist',
		'Project Manager',
		'Software Engineer',
		'Customer Support'
	];
	const levels = ['Junior', 'Mid', 'Senior', 'Lead'];
	const addresses = [
		'123 Lê Lợi, Q1, TP.HCM',
		'45 Hoàng Hoa Thám, Ba Đình, Hà Nội',
		'78 Lạc Long Quân, Tây Hồ, Hà Nội',
		'56 Trường Sa, Q3, TP.HCM',
		'89 Phan Đình Phùng, Đống Đa, Hà Nội',
		'120 Nguyễn Trãi, Thanh Xuân, Hà Nội',
		'78 Trần Hưng Đạo, Q5, TP.HCM',
		'67 Bạch Đằng, Hải Châu, Đà Nẵng',
		'23 Nguyễn Huệ, Q1, TP.HCM',
		'11 Điện Biên Phủ, Q10, TP.HCM'
	];

	return {
		id,
		full_name: fullNames[index],
		role: roles[index % roles.length],
		status: index % 3 !== 0,
		basic_salary: 10000000 + (index % 5) * 2000000,
		level: levels[index % levels.length],
		salary_coefficient: 1.0 + (index % 5) * 0.2,
		gender: index % 2 === 0,
		email: `${fullNames[index].toLowerCase().replace(/ /g, '')}@example.com`,
		phone: `09${(index + 1).toString().padStart(8, '0')}`,
		date_of_birth: `19${80 + (index % 20)}-${((index % 12) + 1)
			.toString()
			.padStart(2, '0')}-${((index % 28) + 1).toString().padStart(2, '0')}`,
		address: addresses[index % addresses.length]
	};
});

export default function EmployeeTable() {
	return (
		<div>
			<CustomTable columns={columns} data={employees} />
		</div>
	);
}
