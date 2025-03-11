import { Plus, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';

export default function CreateProducts() {
	const [productImage, setProductImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null); //
	const _handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProductImage(imageUrl);
		}
	};

	const _handleRemoveImage = () => {
		setProductImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = ''; // Reset input file
		}
	};
	return (
		<div className='text-end mb-4'>
			<Dialog>
				<DialogTrigger asChild>
					<Button className='bg-slate-800 hover:bg-slate-900'>
						<Plus />
						Thêm
					</Button>
				</DialogTrigger>
				<DialogContent className='w-full max-w-2xl mx-auto p-6 space-y-4'>
					<DialogHeader>
						<DialogTitle>Tạo sản phẩm mới</DialogTitle>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid items-center gap-4'>
							<div className='col-span-full'>
								<label htmlFor='file-upload' className='block text-sm font-medium text-gray-900'>
									Hình ảnh sản phẩm
								</label>
								<div className='mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-2 py-4'>
									{productImage ? (
										<div className='relative'>
											<img
												src={productImage}
												width={150}
												alt='Hình sản phẩm'
												className='object-cover rounded-md border'
											/>
											<button
												onClick={_handleRemoveImage}
												className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition'
											>
												<Trash2 size={16} />
											</button>
										</div>
									) : (
										<>
											<Image className='mx-auto size-12 text-gray-300' />
											<div className='mt-4 flex text-sm text-gray-600'>
												<label
													htmlFor='file-upload'
													className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2'
												>
													<span>Chọn ảnh</span>
													<input
														id='file-upload'
														name='file-upload'
														type='file'
														accept='image/*'
														className='sr-only'
														onChange={_handleFileChange}
														ref={fileInputRef}
													/>
												</label>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-center font-bold'>
								Tên sản phẩm
							</Label>
							<Input id='name' type='text' className='col-span-3' />
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label className='text-center font-bold'>Nhà cung cấp</Label>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Chọn nhà cung cấp' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>Nhà cung cấp 1</SelectItem>
									<SelectItem value='2'>Nhà cung cấp 2</SelectItem>
									<SelectItem value='3'>Nhà cung cấp 3</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter className='md:justify-between'>
						<DialogClose asChild>
							<Button type='button' variant='secondary'>
								Close
							</Button>
						</DialogClose>
						<Button type='submit'>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
