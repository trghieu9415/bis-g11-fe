import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationLink,
	PaginationNext,
	PaginationEllipsis
} from '@/components/ui/pagination';

import {
	useReactTable,
	flexRender,
	createColumnHelper,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel
} from '@tanstack/react-table';

import { Button, buttonVariants } from '@/components/ui/button';

import React from 'react';
import moment from 'moment';

type Contract = {
	id_contract: number;
	id_employee: number;
	fullname: string;
	position: string;
	base_salary: number;
	date_start: string;
	date_end: string;
	status: string;
};

interface EmploymentContractProps {
	data?: Contract[];
}

export default function EmployeementContractTable({ data = [] }: EmploymentContractProps) {
	// Header
	const columnHelper = createColumnHelper<Contract>();
	const columnDef = [
		columnHelper.accessor('id_contract', {
			header: 'Mã Hợp Đồng',
			meta: {
				isSticky: true
			}
		}),
		columnHelper.accessor('id_employee', { header: 'Mã Nhân Viên' }),
		columnHelper.accessor('fullname', { header: 'Họ và Tên' }),
		columnHelper.accessor('position', { header: 'Chức Vụ' }),
		columnHelper.accessor('base_salary', { header: 'Lương Cơ Bản' }),
		columnHelper.accessor('date_start', {
			header: 'Ngày Bắt Đầu',
			cell: ({ getValue }) => moment(new Date(getValue())).format('DD/MM/YYYY')
		}),
		columnHelper.accessor('date_end', {
			header: 'Ngày Kết Thúc',
			cell: ({ getValue }) => moment(new Date(getValue())).format('DD/MM/YYYY')
		}),
		columnHelper.accessor('status', { header: 'Trạng Thái' }),
		columnHelper.display({
			id: 'actions',
			header: 'Hành Động',
			cell: ({ row }) => {
				return (
					<div className='flex gap-2'>
						<Button onClick={() => handleView(row.original)} className='bg-blue-500 text-white hover:bg-blue-600'>
							Chi tiết
						</Button>
						<Button onClick={() => handleUpdate(row.original)} className='bg-yellow-500 text-white hover:bg-yellow-600'>
							Sửa
						</Button>
						<Button onClick={() => handleDelete(row.original)} className='bg-red-500 text-white hover:bg-red-600'>
							Xóa
						</Button>
					</div>
				);
			}
		})
	];

	// Body
	const finalData = React.useMemo(() => data, [data]);
	const finalColumnDef = React.useMemo(() => columnDef, []);

	const [sorting, setSorting] = React.useState([]);
	const [filtering, setFiltering] = React.useState('');

	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageSize: 6,
		pageIndex: 0
	});

	const [selectedContract, setSelectedContract] = React.useState(null);
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState('');

	// const handleRowSelect = row => {
	// 	setRowSelection(prev => (prev === row.id ? null : row));
	// };

	// Handle view detail the user
	const handleView = (row: React.SetStateAction<null>) => {
		setSelectedContract(row);
		setIsFormOpen(true);
		setFormMode('view');
		// ...
	};

	// Handle update the user
	const handleUpdate = (row: React.SetStateAction<null>) => {
		setSelectedContract(row);
		setIsFormOpen(true);
		setFormMode('update');
		// ...
	};

	// Handle delete the user
	const handleDelete = (row: React.SetStateAction<null>) => {
		setSelectedContract(row);
		setIsFormOpen(true);
		setFormMode('delete');
		// ...
	};

	const tableInstance = useReactTable({
		data: finalData,
		columns: finalColumnDef,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.getValue(columnId);
			// Chuyển đổi value thành chuỗi trước khi so sánh
			return String(value ?? '')
				.toLowerCase()
				.includes(filterValue.toLowerCase());
		},
		state: {
			sorting,
			globalFilter: filtering,
			rowSelection,
			pagination
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		enableRowSelection: true
	});

	return (
		<div>
			<div className='bg-sidebar-accent p-2 rounded-sm'>
				<input
					type='text'
					placeholder='Tìm kiếm...'
					value={filtering}
					onChange={e => setFiltering(e.target.value)}
					className='p-2 text-sm w-80 outline-none border border-gray-300 rounded'
				/>
			</div>
			<Table>
				<TableHeader>
					{tableInstance.getHeaderGroups().map(headerEl => (
						<TableRow key={headerEl.id}>
							{headerEl.headers.map(columnEl => (
								<TableHead key={columnEl.id} colSpan={columnEl.colSpan}>
									<div style={{ cursor: 'pointer' }} onClick={() => columnEl.column.toggleSorting()}>
										{flexRender(columnEl.column.columnDef.header, columnEl.getContext())}
										{{ asc: ' -UP', desc: ' -DOWN' }[columnEl.column.getIsSorted()] || ''}
									</div>
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{tableInstance.getRowModel().rows.length > 0 ? (
						tableInstance.getRowModel().rows.map(rowEl => (
							<TableRow key={rowEl.id}>
								{rowEl.getVisibleCells().map(cellEl => (
									<TableCell
										key={cellEl.id}
										// Thêm className cho sticky cell
										className={
											cellEl.column.columnDef.meta?.isSticky
												? 'sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
												: ''
										}
									>
										{flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columnDef.length} className='text-center py-4 text-gray-500'>
								Không có kết quả
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{tableInstance.getRowModel().rows.length > 0 && (
				<Pagination>
					<PaginationContent>
						{/* Previous */}
						<PaginationItem
							onClick={() => tableInstance.previousPage()}
							className={`select-none ${!tableInstance.getCanPreviousPage() ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
						>
							<PaginationPrevious href='#' />
						</PaginationItem>

						{/* Page Numbers with Ellipsis */}
						{tableInstance.getPageCount() > 5 ? (
							<>
								{/* Show first page */}
								<PaginationItem onClick={() => tableInstance.setPageIndex(0)}>
									<PaginationLink href='#' isActive={tableInstance.getState().pagination.pageIndex === 0}>
										1
									</PaginationLink>
								</PaginationItem>

								{/* Show `...` if needed */}
								{tableInstance.getState().pagination.pageIndex > 2 && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

								{/* Show pages near current page */}
								{Array.from({ length: tableInstance.getPageCount() }, (_, i) => i)
									.filter(
										pageIndex =>
											pageIndex >= Math.max(1, tableInstance.getState().pagination.pageIndex - 1) &&
											pageIndex <=
												Math.min(tableInstance.getPageCount() - 2, tableInstance.getState().pagination.pageIndex + 1)
									)
									.map(pageIndex => (
										<PaginationItem key={pageIndex} onClick={() => tableInstance.setPageIndex(pageIndex)}>
											<PaginationLink href='#' isActive={tableInstance.getState().pagination.pageIndex === pageIndex}>
												{pageIndex + 1}
											</PaginationLink>
										</PaginationItem>
									))}

								{/* Show `...` before last page */}
								{tableInstance.getState().pagination.pageIndex < tableInstance.getPageCount() - 3 && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

								{/* Last page */}
								<PaginationItem onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}>
									<PaginationLink
										href='#'
										isActive={tableInstance.getState().pagination.pageIndex === tableInstance.getPageCount() - 1}
									>
										{tableInstance.getPageCount()}
									</PaginationLink>
								</PaginationItem>
							</>
						) : (
							// If page count lte 5 then show all
							Array.from({ length: tableInstance.getPageCount() }, (_, i) => i).map(pageIndex => (
								<PaginationItem key={pageIndex} onClick={() => tableInstance.setPageIndex(pageIndex)}>
									<PaginationLink href='#' isActive={tableInstance.getState().pagination.pageIndex === pageIndex}>
										{pageIndex + 1}
									</PaginationLink>
								</PaginationItem>
							))
						)}

						{/* Next */}
						<PaginationItem
							onClick={() => tableInstance.nextPage()}
							className={`select-none ${!tableInstance.getCanNextPage() ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}
						>
							<PaginationNext href='#' />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			{/* Show form to view/edit/delete */}
			{/* {isFormOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50  z-50'>
					<HREmployeeForm employee={selectedContract} mode={formMode} onClose={() => setIsFormOpen(false)} />
				</div>
			)} */}
		</div>
	);
}
