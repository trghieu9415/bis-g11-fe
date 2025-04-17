import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SelectedProduct } from '@/types/product';

type QuantityInputProps = {
	product: SelectedProduct;
	updateQuantity: (id: number, quantity: number) => void;
	removeProduct: (id: number) => void;
};

export default function QuantityInput({ product, updateQuantity }: QuantityInputProps) {
	const [value, setValue] = useState(product.quantity);

	useEffect(() => {
		setValue(product.quantity);
	}, [product.quantity]);

	const handleQuantityChange = (amount: number) => {
		const newQuantity = Math.min(product.stock, Math.max(1, value + amount));
		setValue(newQuantity);
		updateQuantity(product.id, newQuantity);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number(e.target.value);
		if (!isNaN(val)) {
			setValue(val);
		}
	};

	const handleBlur = () => {
		let corrected = value;

		if (value < 1) corrected = 1;
		if (value > product.stock) corrected = product.stock;

		setValue(corrected);
		updateQuantity(product.id, corrected);
	};

	return (
		<div className='flex'>
			<Input
				type='number'
				value={value}
				onChange={handleInputChange}
				onBlur={handleBlur}
				className='text-center rounded-r-none h-8 w-12'
				min={1}
				max={product.stock}
			/>
			<div className='flex flex-col'>
				<Button
					variant='outline'
					size='icon'
					className='rounded-b-none rounded-tl-none h-4 w-4'
					onClick={() => handleQuantityChange(1)}
					disabled={value >= product.stock}
				>
					<ChevronUp className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='rounded-t-none rounded-bl-none h-4 w-4'
					onClick={() => handleQuantityChange(-1)}
					disabled={value <= 1}
				>
					<ChevronDown className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
