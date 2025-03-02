import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	SortingState,
	Table as ReactTable,
	flexRender,
	VisibilityState,
	ColumnFiltersState,
	getFilteredRowModel
} from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from './ui/button';
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CustomDropdownTable } from './custom-dropdown-table';

function Header<DType>({
	table,
	setGlobalFilter
}: {
	table: ReactTable<DType>;
	setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<div className='flex w-full justify-between p-2'>
			<div className='flex w-full items-center'>
				<span className='text-[14px] text-gray-800 mr-4'>Tìm kiếm:</span>
				<Input
					type='text'
					className='w-[30%] rounded-none px-2 focus:ring-0 focus:outline-none h-8'
					placeholder='ID...'
					onChange={e => setGlobalFilter(e.target.value)}
				/>
			</div>
			<div className='z-20'>
				<CustomDropdownTable table={table} />
			</div>
		</div>
	);
}

function CTableHeader<DType>({ table }: { table: ReactTable<DType> }) {
	return (
		<TableHeader>
			{table.getHeaderGroups().map(headerGroup => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header, index) => {
						const stickyClass = index === 1 ? 'sticky left-0 z-10' : '';
						return (
							<TableHead
								key={header.id}
								className={`whitespace-nowrap border border-gray-400 bg-green-800 text-white text-center ${stickyClass}`}
							>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}

function CTableBody<DType>({ table }: { table: ReactTable<DType> }) {
	return (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map(row => (
					<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
						{row.getVisibleCells().map((cell, index) => {
							const stickyClass = index === 1 ? 'sticky left-0 bg-white z-10' : '';
							return (
								<TableCell key={cell.id} className={`whitespace-nowrap border border-gray-200 py-2 ${stickyClass}`}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan={table.getAllColumns().length} className='h-8 text-start'>
						Không tìm thấy kết quả hợp lệ.
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	);
}

function Body<DType>({ table }: { table: ReactTable<DType> }) {
	return (
		<div className='flex w-full overflow-x-auto border-l-2 border-r-2 border-gray-100'>
			<Table>
				<CTableHeader table={table} />
				<CTableBody table={table} />
			</Table>
		</div>
	);
}

function Footer<DType>({ table }: { table: ReactTable<DType> }) {
	const [page, setPage] = useState((table.getState().pagination.pageIndex + 1).toString());

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			const newPage = Math.min(Math.max(Number(page), 1), table.getPageCount()) - 1;
			table.setPageIndex(newPage);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if (e.target.value === '') {
			table.setPageIndex(0);
		} else {
			const newPage = Math.min(Math.max(Number(page), 1), table.getPageCount()) - 1;
			table.setPageIndex(newPage);
		}
	};

	useEffect(() => {
		setPage((table.getState().pagination.pageIndex + 1).toString());
	}, [table.getState().pagination.pageIndex]);

	return (
		<div className='flex items-center justify-between space-x-2 py-4'>
			<div className='flex items-center text-sm'>
				<span className='mr-2'>Hiển thị</span>
				<Select
					value={table.getRowModel().rows.length.toString()}
					onValueChange={value => {
						table.setPageIndex(0);
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger className='w-20'>
						<span>{table.getRowModel().rows.length.toString()}</span>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='5'>5</SelectItem>
						<SelectItem value='10'>10</SelectItem>
						<SelectItem value='15'>15</SelectItem>
						<SelectItem value='20'>20</SelectItem>
					</SelectContent>
				</Select>
				<span className='ml-2'>trong tổng số {table.getRowCount()}</span>
			</div>
			<div className='space-x-2 flex items-center'>
				<div className='flex items-center mr-4'>
					<span className='text-md mr-2'>Trang:</span>
					<Input
						className='w-12 h-9 text-center'
						type='number'
						value={page}
						onClick={() => setPage('')}
						onChange={e => setPage(e.target.value)}
						onKeyDown={e => handleKeyDown(e)}
						onBlur={e => handleBlur(e)}
					/>
					<span className='text-md ml-2'>/ {table.getPageCount()}</span>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronsLeft />
				</Button>
				<Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					<ChevronLeft />
				</Button>
				<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					<ChevronRight />
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	);
}

export default function CustomTable<DType>({
	columns,
	data,
	hiddenColumns = {}
}: {
	columns: ColumnDef<DType>[];
	data: DType[];
	hiddenColumns?: VisibilityState;
}) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(hiddenColumns);
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data: data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter
		}
	});
	return (
		<div className='text-xs border-2 px-4 border-[#e4e4e4]'>
			<Header table={table} setGlobalFilter={setGlobalFilter} />
			<Body table={table} />
			<Footer table={table} />
		</div>
	);
}
