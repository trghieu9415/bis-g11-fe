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
import { ArrowUpDown, CalendarCheck, CheckCircle, Ellipsis, UserRoundPen } from 'lucide-react';
import { useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { RegisterOptions } from 'react-hook-form';

// import data from '@/pages/dashboard/HREmployees/data.json';
import { RootState, useAppDispatch } from '@/redux/store';
import { fetchUsers } from '@/redux/slices/usersSlice';
import { updateUser, deleteUser } from '@/services/userService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Employee = {
	id: number;
	idString: string;
	full_name: string;
	role: string;
	status: boolean;
	base_salary: number;
	level: string;
	salary_coefficient: number;
	gender: boolean;
	email: string;
	phone: string;
	date_of_birth: string;
	address: string;
	username: string;
	password: string;
};

type FieldConfig = {
	label: string;
	key: keyof Employee | 'password';
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
};

export default function EmployeeTable() {
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const dispatch = useAppDispatch();
	const { users } = useSelector((state: RootState) => state.users);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const columns: ColumnDef<Employee>[] = [
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
			),
			enableHiding: false
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
			header: ({ column }) => (
				<Button
					variant='link'
					className='text-white w-30'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => (
				<span className='flex justify-center'>
					{row.getValue('status') ? (
						<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-green-500 rounded-sm p-1'>
							<CheckCircle className='w-4 h-4 mr-1' stroke='white' />
							Đang làm việc
						</p>
					) : (
						<p className='text-white flex items-center gap-1 justify-center w-[84%] bg-yellow-500 rounded-sm p-1'>
							<CalendarCheck className='w-4 h-4 mr-1' stroke='white' /> Tạm nghỉ
						</p>
					)}
				</span>
			),
			sortingFn: (rowA, rowB) => {
				const statusA = rowA.original.status ? 1 : 0;
				const statusB = rowB.original.status ? 1 : 0;
				return statusA - statusB;
			},
			enableHiding: false
		},
		{
			accessorKey: 'base_salary',
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
						<DropdownMenuItem onClick={() => handleOpenDialog(row.original, 'delete')}>Xóa</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const handleOpenDialog = (employee: Employee, mode: 'view' | 'edit' | 'delete') => {
		setSelectedEmployee(employee);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedEmployee(null);
	};

	const hiddenColumns = {
		date_of_birth: false,
		gender: false,
		address: false,
		base_salary: false,
		salary_coefficient: false
	};

	const employeeFields: FieldConfig[][][] = [
		[
			[
				{
					label: 'Họ và tên',
					key: 'full_name',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập họ và tên',
						minLength: { value: 3, message: 'Họ và tên ít nhất 3 ký tự' }
					}
				}
			],
			[
				{
					label: 'Giới tính',
					key: 'gender',
					type: 'select',
					options: [
						{ value: 'false', label: 'Nữ', isBoolean: true },
						{ value: 'true', label: 'Nam', isBoolean: true }
					],
					validation: { required: 'Vui lòng chọn giới tính' }
				},
				{
					label: 'Trạng thái',
					key: 'status',
					type: 'select',
					options: [
						{ value: 'true', label: 'Hoạt động', isBoolean: true },
						{ value: 'false', label: 'Không Hoạt động', isBoolean: true }
					],
					validation: { required: 'Vui lòng chọn trạng thái' }
				}
			]
		],

		[
			[
				{ label: 'ID', key: 'id', type: 'input', disabled: true },
				{
					label: 'Ngày sinh',
					key: 'date_of_birth',
					type: 'date',
					validation: {
						required: 'Vui lòng chọn ngày sinh',
						validate: value => {
							if (!value) return 'Ngày sinh không hợp lệ';

							const birthDate = new Date(value);
							const today = new Date();

							if (birthDate > today) return 'Ngày sinh không thể ở tương lai';

							const age = today.getFullYear() - birthDate.getFullYear();
							const monthDiff = today.getMonth() - birthDate.getMonth();
							const dayDiff = today.getDate() - birthDate.getDate();

							if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
								return 'Ngày sinh phải trên 18 tuổi';
							}

							return true;
						}
					}
				}
			],
			[{ label: 'Vai trò', key: 'role', type: 'input', disabled: true }]
		],
		[
			[{ label: 'Cấp bậc', key: 'level', type: 'input', disabled: true }],
			[
				{ label: 'Lương cơ bản', key: 'base_salary', type: 'number', disabled: true },
				{ label: 'Hệ số lương', key: 'salary_coefficient', type: 'number', disabled: true }
			]
		],
		[
			[
				{
					label: 'Địa chỉ',
					key: 'address',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập địa chỉ',
						pattern: {
							value:
								/^\d+\s[\p{L}0-9\s]+,\s(?:Phường|Xã)\s[\p{L}0-9\s]+,\s(?:Quận|Huyện)\s[\p{L}0-9\s]+,\s[\p{L}\s.]+$/u,
							message: 'Địa chỉ không hợp lệ. Ví dụ: 273 An Dương Vương, Phường 3, Quận 5, TP.HCM'
						}
					}
				}
			]
		],
		[
			[
				{
					label: 'Email',
					key: 'email',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập email',
						pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email không hợp lệ' }
					}
				}
			],
			[
				{
					label: 'SĐT',
					key: 'phone',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập số điện thoại',
						pattern: { value: /^0\d{9}$/, message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0' }
					}
				}
			]
		],
		[
			[
				{
					label: 'Username',
					disabled: true,
					key: 'username',
					type: 'input'
				}
			],
			[
				{
					label: 'Mật khẩu (Để trống nếu không đổi)',
					key: 'password',
					type: 'input',
					showOnly: 'edit',
					validation: {
						pattern: {
							value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
							message: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
						}
					}
				}
			]
		]
	];

	const handleSave = async (data: Employee) => {
		const userId = data.id;
		const updatedUserData = {
			fullName: data.full_name,
			phoneNumber: data.phone,
			email: data.email,
			dateOfBirth: data.date_of_birth,
			address: data.address,
			gender: data.gender ? 'MALE' : 'FEMALE',
			username: data.username,
			password: ''
		};

		if (data.password) {
			updatedUserData.password = data.password;
		}

		// Call API for update user info
		try {
			await updateUser(userId, updatedUserData);
			toast.success('Cập nhật thông tin nhân viên thành công!');
			dispatch(fetchUsers());
			setIsDialogOpen(false);
		} catch (error: unknown) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleDelete = async (data: Employee) => {
		const userId = data.id;

		try {
			await deleteUser(userId);
			toast.success('Cập nhật thông tin nhân viên thành công!');
			dispatch(fetchUsers());
			setIsDialogOpen(false);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy nhân viên.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div>
			<CustomTable columns={columns} data={users} hiddenColumns={hiddenColumns} />
			{selectedEmployee && (
				<CustomDialog
					entity={selectedEmployee}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={employeeFields}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
}
