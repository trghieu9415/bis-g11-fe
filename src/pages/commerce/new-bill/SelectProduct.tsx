import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { getListProducts } from '@/services/productService';
import { Product } from '@/types/product';
type SelectProductProps = {
	onChange: (product: Product) => void;
};

export function SelectProduct({ onChange }: SelectProductProps) {
	const [open, setOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product>();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await getListProducts();
			if (res) {
				setProducts(res.data);
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
			<PopoverContent className='p-0 w-[600px]' align='start'>
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
										onChange(product);
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
