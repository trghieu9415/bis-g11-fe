import { ColumnDef, flexRender, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import { SelectedProduct } from '@/types/product';
import QuantityInput from './QuantityInput';
import { useMemo } from 'react';

type ProductTableProps = {
	products: SelectedProduct[];
	setProducts: (value: React.SetStateAction<SelectedProduct[]>) => void;
};

export default function ProductsTable({ products, setProducts }: ProductTableProps) {
	const updateQuantity = (id: number, quantity: number) => {
		setProducts(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
	};

	const removeProduct = (id: number) => {
		setProducts(prev => prev.filter(item => item.id !== id));
	};

	const columns = useMemo<ColumnDef<SelectedProduct>[]>(
		() => [
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
					return <QuantityInput product={product} updateQuantity={updateQuantity} removeProduct={removeProduct} />;
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
				header: 'Xóa',
				cell: ({ row }) => (
					<Button variant='ghost' className='!text-red-400' onClick={() => removeProduct(row.original.id)}>
						<X />
					</Button>
				)
			}
		],
		[updateQuantity, removeProduct]
	);

	const table = useReactTable({
		data: products,
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
					{products.length > 0 ? (
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
