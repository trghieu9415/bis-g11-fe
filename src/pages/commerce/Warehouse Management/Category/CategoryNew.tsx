import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import { AppDispatch } from '@/redux/store';
import { useState } from 'react';
import { fetchAuthor } from '@/redux/slices/authorSlice';
import { addAuthor } from '@/services/authorService';
import { addCategory } from '@/services/categoryService';

type FormField = {
	name: string;
};

export default function CategoryNew() {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const {
		register,
		reset,
		formState: { errors },
		handleSubmit
	} = useForm<FormField>();
	const openDialog = () => {
		reset();
		setIsOpen(true);
	};
	const closeDialog = () => setIsOpen(false);
	const onSubmit = async (data: FormField) => {
		console.log('Dữ liệu đã nhập:', data);
		const formatedData = {
			name: data.name
		};
		console.log(formatedData);

		try {
			await addCategory(formatedData);
			toast.success('Thêm danh mục thành công!');
			closeDialog();
			reset();
			dispatch(fetchAuthor());
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error((err.response?.data as any).message);
			} else if (err.response?.status === 404) {
				toast.error((err.response?.data as any).message);
			} else if (err.response?.status === 500) {
				toast.error((err.response?.data as any).message);
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='mb-4 text-end'>
			<Button className='bg-slate-800 hover:bg-slate-900' onClick={openDialog}>
				<Plus />
				Thêm
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild></DialogTrigger>
				<DialogContent className='mx-auto w-full max-w-2xl space-y-4 p-6'>
					<DialogHeader>
						<DialogTitle>Tạo danh mục mới</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='grid gap-12 py-4'>
							<div className='grid items-center gap-4'>
								<div>
									<Label htmlFor='name' className='text-right font-bold'>
										Tên danh mục
									</Label>
									<Input
										id='name'
										type='text'
										className='col-span-3 mt-1'
										{...register('name', { required: 'Vui lòng nhập tên danh mục' })}
									/>
									{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
								</div>
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
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
