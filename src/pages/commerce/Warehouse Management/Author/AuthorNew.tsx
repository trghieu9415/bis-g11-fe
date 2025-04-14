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
import { addSupplier } from '@/services/supplierService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchSuppliers } from '@/redux/slices/supplierSlice';
import { AxiosError } from 'axios';
import { AppDispatch } from '@/redux/store';
import { useState } from 'react';
import { fetchAuthor } from '@/redux/slices/authorSlice';
import { addAuthor } from '@/services/authorService';

type FormField = {
	name: string;
};

export default function AuthorNew() {
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
			await addAuthor(formatedData);
			toast.success('Thêm tác giả thành công!');
			closeDialog();
			reset();
			dispatch(fetchAuthor());
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error('Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='text-end mb-4'>
			<Button className='bg-slate-800 hover:bg-slate-900' onClick={openDialog}>
				<Plus />
				Thêm
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild></DialogTrigger>
				<DialogContent className='w-full max-w-2xl mx-auto p-6 space-y-4'>
					<DialogHeader>
						<DialogTitle>Tạo tác giả mới</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='grid gap-12 py-4'>
							<div className='grid items-center gap-4'>
								<div>
									<Label htmlFor='name' className='text-right font-bold'>
										Tên tác giả
									</Label>
									<Input
										id='name'
										type='text'
										className='col-span-3 mt-1'
										{...register('name', { required: 'Vui lòng nhập tên tác giả' })}
									/>
									{errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
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
