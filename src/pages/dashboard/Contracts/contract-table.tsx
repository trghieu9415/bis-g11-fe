import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Ban, CircleCheckBig, Ellipsis, UserRoundPen } from 'lucide-react';
import { useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { RegisterOptions } from 'react-hook-form';

// import data from '@/pages/dashboard/HREmployees/data.json';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchUsers } from '@/redux/slices/usersSlice';
import { fetchContracts } from '@/redux/slices/contractsSlice';
import { updateUser, deleteUser } from '@/services/userService';
import { updateContract } from '@/services/contractService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Contract = {
	id: number;
	idString: string;
	userId: number;
	userIdString: string;
	fullName: string;
	baseSalary: string;
	status: boolean;
	statusLabel: string;
	startDate: string;
	endDate: string;
	expiryDate: string;
	roleName: string;
	levelName: string;
	salaryCoefficient: number;
};

type FieldConfig = {
	label: string;
	key: keyof Contract;
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
};

export default function ContractTable() {
	const [selectedContract, setSelectedContract] = useState<Partial<Contract>>({} as Partial<Contract>);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { contracts } = useSelector((state: RootState) => state.contracts);

	useEffect(() => {
		dispatch(fetchContracts());
	}, [dispatch]);

	// console.log(contracts);

	const columns: ColumnDef<Contract>[] = [
		{
			accessorKey: 'idString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-16'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID <ArrowUpDown />
				</Button>
			),
			enableHiding: false
		},
		{
			accessorKey: 'fullName',
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
					{row.getValue('fullName')}
				</span>
			),
			enableHiding: false
		},
		{
			accessorKey: 'roleName',
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
			accessorKey: 'levelName',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-40'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Cấp bậc <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'statusLabel',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-20'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-center'>
					{row.getValue('statusLabel') === 'Hiệu lực' ? (
						<CircleCheckBig color='#31843f' strokeWidth={3} />
					) : (
						<Ban color='#ef5350' strokeWidth={3} />
					)}
				</span>
			),
			sortingFn: (rowA, rowB) => {
				const statusA = rowA.original.statusLabel === 'Hiệu lực' ? 1 : 0;
				const statusB = rowB.original.statusLabel === 'Hiệu lực' ? 1 : 0;
				return statusA - statusB;
			},
			enableHiding: false
		},
		{
			accessorKey: 'baseSalary',
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
			accessorKey: 'salaryCoefficient',
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
			accessorKey: 'startDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-28'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày bắt đầu <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'endDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-28'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày kết thúc <ArrowUpDown />
				</Button>
			)
		},

		{
			accessorKey: 'expiryDate',
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-28'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Ngày hết hạn <ArrowUpDown />
				</Button>
			)
		},
		{
			id: 'actions',
			header: 'Thao tác',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<Ellipsis className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'view')}>Xem</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'edit')}>Sửa</DropdownMenuItem>
						{/* <DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (contract: Contract, mode: 'view' | 'edit' | 'delete') => {
		setSelectedContract(contract);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedContract({});
	};

	const hiddenColumns = {
		baseSalary: false,
		salaryCoefficient: false
	};

	const contractsFields: FieldConfig[][][] = [
		[
			[
				{
					label: 'Mã hợp đồng',
					key: 'idString',
					type: 'input',
					disabled: true
				},
				{
					label: 'Mã nhân viên',
					key: 'userIdString',
					type: 'input',
					disabled: true
				}
			],
			[
				{
					label: 'Họ và tên',
					key: 'fullName',
					type: 'input',
					disabled: true
				}
			]
		],
		[
			[
				{ label: 'Ngày bắt đầu', key: 'startDate', type: 'date', disabled: true },
				{ label: 'Ngày kết thúc', key: 'endDate', type: 'date', disabled: true }
			],
			[
				{
					label: 'Ngày hết hạn',
					key: 'expiryDate',
					type: 'date',
					validation: {
						required: 'Ngày hết hạn là bắt buộc',
						validate: value => {
							if (!value || !selectedContract?.startDate) return true;
							const expiryDate = new Date(value);
							const startDate = new Date(selectedContract?.startDate);
							return expiryDate >= startDate || 'Ngày hết hạn phải lớn hơn hoặc bằng ngày bắt đầu';
						}
					}
				},
				{
					label: 'Trạng thái',
					key: 'status',
					type: 'input',
					disabled: true
				}
			]
		],
		[
			[
				{
					label: 'Vai trò',
					key: 'roleName',
					type: 'input',
					disabled: true
				}
			],
			[
				{ label: 'Lương cơ bản', key: 'baseSalary', type: 'input', disabled: true },
				{ label: 'Hệ số lương', key: 'salaryCoefficient', type: 'number', disabled: true }
			]
		],
		[
			[
				{
					label: 'Cấp bậc',
					key: 'levelName',
					type: 'input',
					disabled: true
				}
			],
			[]
		]
	];

	// console.log(selectedContract);

	const handleSave = async (data: Contract) => {
		console.log(data);
		// const idContract = data.id;
		// const contractData = {
		// 	baseSalary: data.baseSalary,
		// 	startDate: data.startDate,
		// 	endDate: data.endDate,
		// 	expiryDate: data.expiryDate,
		// 	userId: data.userId,
		// 	seniorityId: data.levelId
		// };
		// Call API for update user info
		try {
			await updateContract(idContract, contractData);
			toast.success('Cập nhật hợp đồng thành công!');
			dispatch(fetchUsers());
			setIsDialogOpen(false);
		} catch (error: unknown) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy hợp đồng.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	// const handleDelete = async (data: Employee) => {
	// 	const userId = data.id;

	// 	try {
	// 		await deleteUser(userId);
	// 		toast.success('Cập nhật thông tin nhân viên thành công!');
	// 		dispatch(fetchUsers());
	// 		setIsDialogOpen(false);
	// 	} catch (error) {
	// 		const err = error as AxiosError;

	// 		if (err.response?.status === 400) {
	// 			toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
	// 		} else if (err.response?.status === 404) {
	// 			toast.error('Lỗi 404: Không tìm thấy nhân viên.');
	// 		} else if (err.response?.status === 500) {
	// 			toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
	// 		} else {
	// 			toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
	// 		}
	// 	}
	// };

	return (
		<div>
			<CustomTable columns={columns} data={contracts} hiddenColumns={hiddenColumns} />
			{selectedContract && (
				<CustomDialog
					entity={selectedContract}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={contractsFields}
					onSave={handleSave}
					// onDelete={handleDelete}
				/>
			)}
		</div>
	);
}
