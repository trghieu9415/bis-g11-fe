'use client';

import { useState } from 'react';
import { ColumnDef, flexRender, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

type Product = {
	id: string;
	name: string;
	price: number;
	quantity: number;
};

const initialData: Product[] = [
	{ id: '1', name: 'Product 1', price: 10000, quantity: 10 },
	{ id: '3', name: 'Product 3', price: 30000, quantity: 14 },
	{ id: '4', name: 'Product 4', price: 40000, quantity: 12 },
	{ id: '5', name: 'Product 5', price: 50000, quantity: 7 },
	{ id: '5', name: 'Product 5', price: 50000, quantity: 7 },
	{ id: '5', name: 'Product 5', price: 50000, quantity: 7 },
	{ id: '5', name: 'Product 5', price: 50000, quantity: 7 },
	{ id: '2', name: 'Product 2', price: 20000, quantity: 5 }
];

export default function ProductsTable() {
	const [data, setData] = useState<Product[]>(initialData);

	const updateQuantity = (id: string, quantity: number) => {
		setData(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
	};

	const removeProduct = (id: string) => {
		setData(prev => prev.filter(item => item.id !== id));
	};

	const columns: ColumnDef<Product>[] = [
		{ accessorKey: 'id', header: 'ID' },
		{ accessorKey: 'name', header: 'Tên sản phẩm' },
		{
			accessorKey: 'price',
			header: 'Đơn giá (vnđ)',
			cell: ({ row }) => <span>{new Intl.NumberFormat('vi-VN').format(row.original.price)}</span>
		},
		{
			accessorKey: 'quantity',
			header: 'Số lượng',
			cell: ({ row }) => {
				const product = row.original;

				const handleQuantityChange = (amount: number) => {
					const newQuantity = Math.max(0, product.quantity + amount);
					if (newQuantity === 0) removeProduct(product.id);
					updateQuantity(product.id, newQuantity);
				};

				return (
					<div className='flex'>
						<Input
							type='number'
							value={product.quantity}
							onChange={e => updateQuantity(product.id, Number(e.target.value))}
							className='w-16 text-center rounded-r-none h-8 w-12'
						/>
						<div className='flex flex-col'>
							<Button
								variant='outline'
								size='icon'
								className='rounded-b-none rounded-tl-none h-4 w-4'
								onClick={() => handleQuantityChange(1)}
							>
								<ChevronUp className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='rounded-t-none rounded-bl-none h-4 w-4'
								onClick={() => handleQuantityChange(-1)}
							>
								<ChevronDown className='h-4 w-4' />
							</Button>
						</div>
					</div>
				);
			}
		},
		{
			id: 'total',
			header: 'Thành tiền (vnđ)',
			cell: ({ row }) => (
				<span>{new Intl.NumberFormat('vi-VN').format(row.original.quantity * row.original.price)}</span>
			)
		},
		{
			id: 'action',
			header: '#',
			cell: ({ row }) => (
				<Button variant='ghost' className='!text-red-400' onClick={() => removeProduct(row.original.id)}>
					<X />
				</Button>
			)
		}
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<div className='border border-gray-200 rounded-lg p-4 flex flex-col h-[300px] shadow-md'>
			<Table>
				<TableHeader className='sticky top-0 bg-white z-10 shadow-sm'>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className='overflow-auto'>
					{data.length > 0 ? (
						table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id} className='h-12 p-2'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='text-center text-gray-500 !p-2'>
								Không có sản phẩm nào
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
