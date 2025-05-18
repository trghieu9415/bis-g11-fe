import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { getListProducts } from '@/services/productService';
import { Product } from '@/types/product';
import { getListSuppliers } from '@/services/supplierService';
import { Supplier } from '../Warehouse Management/Supplier/SupplierTable';

type SelectProductProps = {
	onChange: (product: Product) => void;
};
interface ProductWithCalculatedPrice extends Product {
	calculatedPrice: number;
	originalPrice: number;
}
export function SelectProduct({ onChange }: SelectProductProps) {
	const [open, setOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<ProductWithCalculatedPrice>();
	const [products, setProducts] = useState<ProductWithCalculatedPrice[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await getListProducts();
				const resSupplier = await getListSuppliers();

				if (res && resSupplier) {
					const suppliers = resSupplier.data;
					const productList = res.data;
					
					// Tạo map để tra cứu nhanh thông tin nhà cung cấp theo ID
					const supplierMap = new Map<number, Supplier>();
					suppliers.forEach((supplier: Supplier) => {
						supplierMap.set(supplier.id, supplier);
					});

					// Map lại mảng sản phẩm, tính giá mới dựa trên phần trăm của nhà cung cấp
					const productsWithCalculatedPrice = productList.map(product => {
						const supplier = supplierMap.get(product.supplierId);
						let calculatedPrice = product.price;

						// Tính giá mới nếu tìm thấy nhà cung cấp và có phần trăm
						if (supplier && supplier.percentage) {
							calculatedPrice = (product.price * (100 + supplier.percentage)) / 100;
						}

						return {
							...product,
							originalPrice: product.price,
							calculatedPrice: calculatedPrice
						};
					});

					setProducts(productsWithCalculatedPrice);
				}
			} catch (error) {
				console.error('Lỗi khi tải dữ liệu:', error);
			}
		};
		fetchProducts();
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className='flex-grow'>
				<Button variant='outline' role='combobox' aria-expanded={open} className='justify-between'>
					{selectedProduct ? selectedProduct.name : 'Chọn sản phẩm...'}
					<ChevronsUpDown className='opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[600px] p-0' align='start'>
				<Command>
					<CommandInput placeholder='Tìm kiếm sản phẩm...' />
					<CommandList>
						<CommandEmpty>Không tìm thấy sản phẩm</CommandEmpty>
						<CommandGroup>
							{products.map(product => (
								<CommandItem
									key={product.id}
									value={product.name}
									onSelect={() => {
										setSelectedProduct(product);
										onChange({
											...product,
											price: product.calculatedPrice // Đảm bảo trả về sản phẩm với giá đã tính
										});
										setOpen(false);
									}}
								>
									{product.name}
									<Check className={cn('ml-auto', selectedProduct?.id === product.id ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
