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

type FormField = {
	name: string;
	phone: string;
	address: string;
	email: string;
	percentage: number;
};

export default function CreateSupplier() {
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
			name: data.name,
			phoneNumber: data.phone,
			email: data.email,
			percentage: Number(data.percentage),
			address: data.address
		};
		console.log(formatedData);

		try {
			await addSupplier(formatedData);
			toast.success('Thêm nhà cung cấp thành công!');
			closeDialog();
			reset();
			dispatch(fetchSuppliers());
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
						<DialogTitle>Tạo nhà cung cấp mới</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='grid gap-12 py-4'>
							<div className='grid grid-cols-2 items-center gap-4'>
								<div>
									<Label htmlFor='name' className='text-right font-bold'>
										Tên nhà cung cấp
									</Label>
									<Input
										id='name'
										type='text'
										className='col-span-3 mt-1'
										{...register('name', { required: 'Vui lòng nhập tên nhà cung cấp' })}
									/>
									{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
								</div>

								<div>
									<Label htmlFor='phone' className='text-right font-bold'>
										Số điện thoại
									</Label>
									<Input
										id='phone'
										type='text'
										className='col-span-3 mt-1'
										{...register('phone', {
											required: 'Vui lòng nhập số điện thoại',
											pattern: { value: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 chữ số)' }
										})}
									/>
									{errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
								</div>
							</div>

							<div className='grid items-center gap-4'>
								<div>
									<Label htmlFor='address' className='text-center font-bold'>
										Địa chỉ
									</Label>
									<Input
										id='address'
										type='text'
										className='col-span-3 mt-1 w-full'
										{...register('address', { required: 'Vui lòng nhập địa chỉ' })}
									/>
									{errors.address && <p className='text-sm text-red-500'>{errors.address.message}</p>}
								</div>
							</div>

							<div className='grid grid-cols-2 items-center gap-4'>
								<div>
									<Label htmlFor='email' className='text-right font-bold'>
										Email
									</Label>
									<Input
										id='email'
										type='text'
										className='col-span-3 mt-1'
										{...register('email', {
											required: 'Vui lòng nhập email',
											pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
										})}
									/>
									{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
								</div>

								<div>
									<Label htmlFor='percentage' className='text-right font-bold'>
										Chiết khấu (%)
									</Label>
									<Input
										id='percentage'
										type='number'
										className='col-span-3 mt-1'
										{...register('percentage', {
											required: 'Vui lòng nhập chiết khấu',
											min: { value: 1, message: 'Chiết khấu không hợp lệ' },
											max: { value: 99, message: 'Chiết khấu không hợp lệ' }
										})}
									/>
									{errors.percentage && <p className='text-sm text-red-500'>{errors.percentage.message}</p>}
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
