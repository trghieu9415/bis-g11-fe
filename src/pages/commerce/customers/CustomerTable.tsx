import CustomDialog from '@/components/custom-dialog';
import CustomTable from '@/components/custom-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Customer } from '@/types/customer';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { deleteCustomer, updateCustomer } from '@/services/customerService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type FieldConfig = {
	label: string;
	key: keyof Customer | 'password';
	type: 'input' | 'select' | 'number' | 'date';
	options?: { value: string; label: string; isBoolean?: boolean }[];
	disabled?: boolean;
	validation?: RegisterOptions;
	showOnly?: 'view' | 'edit' | 'delete';
};

type CustomerTableProps = {
	customers: Customer[];
	fetchCustomers: () => Promise<void>;
};

const CustomerTable = ({ customers, fetchCustomers }: CustomerTableProps) => {
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');

	const handleOpenDialog = (customer: Customer, mode: 'view' | 'edit' | 'delete') => {
		setSelectedCustomer(customer);
		setDialogMode(mode);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedCustomer(null);
	};

	const hiddenColumns = {
		createdAt: false
	};

	const handleSave = async (data: Customer) => {
		const customerId = data.id;
		const updatedCustomerData = {
			name: data.name,
			phoneNumber: data.phoneNumber,
			email: data.email,
			address: data.address,
			status: data.status
		};
		try {
			await updateCustomer(customerId, updatedCustomerData);
			toast.success('Cập nhật thông tin khách hàng thành công!');
			setIsDialogOpen(false);
			await fetchCustomers();
		} catch (error: unknown) {
			const err = error as AxiosError;
			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy khách hàng.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleDelete = async (data: Customer) => {
		const customerId = data.id;
		try {
			await deleteCustomer(customerId);
			await fetchCustomers();
			toast.success('Xóa khách hàng thành công!');
			handleCloseDialog();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			}
		}
	};

	const columns: ColumnDef<Customer>[] = [
		{
			accessorKey: 'idString',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-16 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					ID <ArrowUpDown />
				</Button>
			),
			enableHiding: false
		},
		{
			accessorKey: 'name',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Tên khách hàng <ArrowUpDown />
				</Button>
			),
			enableHiding: false
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-40 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Trạng thái <ArrowUpDown />
				</Button>
			),
			cell: ({ row }) => {
				const status = row.getValue<number>('status');
				return (
					<span className='flex justify-center'>
						{status === 1 ? (
							<p className='flex w-full items-center justify-center gap-1 rounded-sm bg-green-500 p-1 text-white'>
								<CheckCircle className='mr-1 h-4 w-4' stroke='white' />
								Hoạt động
							</p>
						) : (
							<p className='flex w-full items-center justify-center gap-1 rounded-sm bg-red-500 p-1 text-white'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='mr-1 size-4'
								>
									<path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
								</svg>
								Ngưng hoạt động
							</p>
						)}
					</span>
				);
			}
		},
		{
			accessorKey: 'email',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-52 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'phoneNumber',
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
			accessorKey: 'address',
			header: ({ column }) => (
				<Button
					variant='link'
					className='w-72 text-white'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Địa chỉ <ArrowUpDown />
				</Button>
			)
		},
		{
			accessorKey: 'createdAt',
			header: 'Ngày tạo',
			cell: ({ row }) => new Date(row.getValue('createdAt')).toISOString().split('T')[0] // Ví dụ: 2025-04-01
		},
		{
			id: 'actions',
			header: 'Thao tác',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<Ellipsis className='h-4 w-4' />
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

	const customerFields: FieldConfig[][][] = [
		[
			[
				{
					label: 'Họ và tên',
					key: 'name',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập họ và tên',
						minLength: {
							value: 3,
							message: 'Họ và tên ít nhất 3 ký tự'
						}
					}
				}
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
						minLength: {
							value: 3,
							message: 'Địa chỉ phải có ít nhất 10 ký tự'
						}
					}
				}
			]
		],
		[
			[
				{
					label: 'ID',
					key: 'id',
					type: 'input',
					disabled: true
				},
				{
					label: 'Trạng thái',
					key: 'status',
					type: 'select',
					options: [
						{ value: '1', label: 'Hoạt động' },
						{ value: '0', label: 'Ngưng hoạt động' }
					],
					validation: {
						required: 'Vui lòng chọn trạng thái'
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
						pattern: {
							value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							message: 'Email không hợp lệ'
						}
					}
				}
			],
			[
				{
					label: 'Số điện thoại',
					key: 'phoneNumber',
					type: 'input',
					validation: {
						required: 'Vui lòng nhập số điện thoại',
						pattern: {
							value: /^0\d{9}$/,
							message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0'
						}
					}
				}
			]
		]
	];

	return (
		<div>
			<CustomTable columns={columns} data={customers} hiddenColumns={hiddenColumns} />
			{selectedCustomer && (
				<CustomDialog
					entity={selectedCustomer}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
					mode={dialogMode}
					fields={customerFields}
					onSave={handleSave}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
};

export default CustomerTable;
