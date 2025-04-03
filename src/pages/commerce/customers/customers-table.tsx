import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowUpDown, CheckCircle2, XCircle } from 'lucide-react';
import { Customer, CustomerStatus, CustomerSort } from '@/types/customer';
import { CustomerDetailDialog } from './customer-detail-dialog';
import { CustomerEditDialog } from './customer-edit-dialog';

interface CustomersTableProps {
	customers: Customer[];
	sortField: CustomerSort['field'];
	sortDirection: CustomerSort['direction'];
	onSort: (field: CustomerSort['field']) => void;
	onDelete: (id: string) => void;
	onEdit: (customer: Customer) => void;
}

export const CustomersTable = ({
	customers,
	sortField,
	sortDirection,
	onSort,
	onDelete,
	onEdit
}: CustomersTableProps) => {
	const getStatusIcon = (status: CustomerStatus) => {
		switch (status) {
			case 'active':
				return <CheckCircle2 className='w-4 h-4 text-green-500' />;
			case 'inactive':
				return <XCircle className='w-4 h-4 text-red-500' />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full overflow-auto'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>Mã khách hàng</TableHead>
						<TableHead className='w-[200px] cursor-pointer' onClick={() => onSort('fullName')}>
							<div className='flex items-center gap-1'>
								Họ tên
								<ArrowUpDown className='h-4 w-4' />
								{sortField === 'fullName' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
							</div>
						</TableHead>
						<TableHead className='w-[150px] cursor-pointer' onClick={() => onSort('phone')}>
							<div className='flex items-center gap-1'>
								Số điện thoại
								<ArrowUpDown className='h-4 w-4' />
								{sortField === 'phone' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
							</div>
						</TableHead>
						<TableHead className='w-[200px] cursor-pointer' onClick={() => onSort('email')}>
							<div className='flex items-center gap-1'>
								Email
								<ArrowUpDown className='h-4 w-4' />
								{sortField === 'email' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
							</div>
						</TableHead>
						<TableHead className='min-w-[300px]'>Địa chỉ</TableHead>
						<TableHead className='w-[100px]'>Trạng thái</TableHead>
						<TableHead className='w-[120px] cursor-pointer' onClick={() => onSort('createdAt')}>
							<div className='flex items-center gap-1'>
								Ngày tạo
								<ArrowUpDown className='h-4 w-4' />
								{sortField === 'createdAt' && <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
							</div>
						</TableHead>
						<TableHead className='w-[120px]'>Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className='text-center py-4'>
								Không có khách hàng nào
							</TableCell>
						</TableRow>
					) : (
						customers.map(customer => (
							<TableRow key={customer.id}>
								<TableCell className='font-medium'>{customer.customerCode}</TableCell>
								<TableCell>{customer.fullName}</TableCell>
								<TableCell>{customer.phone}</TableCell>
								<TableCell>{customer.email}</TableCell>
								<TableCell className='max-w-[300px] truncate'>{customer.address}</TableCell>
								<TableCell>
									<div className='flex items-center justify-center'>{getStatusIcon(customer.status)}</div>
								</TableCell>
								<TableCell>
									{format(new Date(customer.createdAt), 'dd/MM/yyyy', {
										locale: vi
									})}
								</TableCell>
								<TableCell>
									<div className='flex gap-2'>
										<CustomerDetailDialog customer={customer} />
										<CustomerEditDialog customer={customer} onEdit={onEdit} />
										<Button
											variant='destructive'
											size='sm'
											onClick={() => onDelete(customer.id)}
											title='Xóa khách hàng'
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
