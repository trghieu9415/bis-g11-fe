import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Plus } from 'lucide-react';
import ProductsTable from './ProductsTable';
import { SelectProduct } from './SelectProduct';
import { Product, SelectedProduct } from '@/types/product';

type Props = {
	products: SelectedProduct[];
	setProducts: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
};

export default function OrderProduct({ products, setProducts }: Props) {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const handleAddProductToBill = () => {
		if (!selectedProduct) return;

		setProducts(prev => {
			const existingProduct = prev.find(product => product.id === selectedProduct.id);
			if (existingProduct) {
				return prev.map(product =>
					product.id === selectedProduct.id
						? {
								...product,
								quantity: Math.min(product.quantity + 1, product.stock)
							}
						: product
				);
			}
			const newSelected: SelectedProduct = {
				id: selectedProduct.id,
				name: selectedProduct.name,
				price: selectedProduct.price,
				quantity: 1,
				stock: selectedProduct.quantity
			};

			return [...prev, newSelected];
		});
	};

	const handleReset = () => {
		setProducts([]);
		setSelectedProduct(null);
	};

	return (
		<div className='flex flex-col gap-y-5 w-full'>
			<div className='flex justify-between items-center flex-grow gap-x-5'>
				<div className='w-[650px] flex items-center'>
					<Button onClick={handleAddProductToBill} variant='default' className='rounded-r-none border-r-0'>
						<Plus />
					</Button>
					<SelectProduct onChange={setSelectedProduct} />
				</div>
				<Button variant='outline' onClick={handleReset} className='hover:bg-red-600 hover:text-white'>
					<RotateCcw />
					<span>Đặt lại</span>
				</Button>
			</div>
			<div>
				<ProductsTable products={products} setProducts={setProducts} />
			</div>
		</div>
	);
}
