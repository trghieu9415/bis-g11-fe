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

type Employee = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	gender: string;
	ip_address: string;
	phone: string;
	date: string;
};

interface HREmployeeTableProps {
	data?: Employee[];
}

export default function HREmployeeTable({ data = [] }: HREmployeeTableProps) {
	// Header
	const columnHelper = createColumnHelper<Employee>();
	const columnDef = [
		columnHelper.accessor('id', { header: 'ID', filterFn: 'includesString' }),
		columnHelper.accessor('first_name', { header: 'First Name' }),
		columnHelper.accessor('last_name', { header: 'Last Name' }),
		columnHelper.accessor('email', { header: 'Email' }),
		columnHelper.accessor('gender', { header: 'Gender' }),
		columnHelper.accessor('phone', { header: 'Phone' }),
		columnHelper.accessor('date', {
			header: 'Date',
			cell: ({ getValue }) => moment(new Date(getValue())).format('MMM Do YY')
		}),
		columnHelper.display({
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				return (
					<div className='flex gap-2'>
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

	// const handleRowSelect = row => {
	// 	setRowSelection(prev => (prev === row.id ? null : row));
	// };

	// Handle update the user
	const handleUpdate = row => {
		console.log(row);
		// ...
	};

	// Handle delete the user
	const handleDelete = row => {
		console.log(row);
		// ...
	};

	const tableInstance = useReactTable({
		data: finalData,
		columns: finalColumnDef,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting: sorting,
			globalFilter: filtering,
			rowSelection: rowSelection,
			pagination: pagination
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		enableRowSelection: true
	});

	return (
		<>
			<Table>
				<TableHeader>
					{tableInstance.getHeaderGroups().map(headerEl => (
						<TableRow key={headerEl.id}>
							{headerEl.headers.map(columnEl => (
								<TableHead key={columnEl.id} colSpan={columnEl.colSpan}>
									<div style={{ cursor: 'pointer' }} onClick={() => columnEl.column.toggleSorting()} className='mb-3'>
										{flexRender(columnEl.column.columnDef.header, columnEl.getContext())}
										{{ asc: ' -UP', desc: ' -DOWN' }[columnEl.column.getIsSorted()] || ''}
										{columnEl.column.getCanFilter() && (
											<div onClick={e => e.stopPropagation()}>
												<input
													type='text'
													value={(columnEl.column.getFilterValue() || '') as string}
													onChange={e => columnEl.column.setFilterValue(e.target.value)}
													className='mt-2 border border-gray-400 rounded p-1'
												/>
											</div>
										)}
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
									<TableCell key={cellEl.id}>{flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}</TableCell>
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
		</>
	);
}
