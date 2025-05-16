import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCustomer } from '@/services/customerService';
import { toast } from 'react-toastify';
import { DialogDescription } from '@radix-ui/react-dialog';

const formSchema = z.object({
	name: z.string().min(1, { message: 'Tên khách hàng không được để trống' }),
	phoneNumber: z.string().regex(/^(0|84|\+84)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/, {
		message: 'Số điện thoại không hợp lệ (VD: 0338641606)'
	}),
	email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
		message: 'Email không hợp lệ (VD: example@gmail.com)'
	}),
	address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
	status: z.number().optional()
});

type CustomerFormValues = z.infer<typeof formSchema>;

type CreateCustomerFormProps = {
	fetchCustomers?: () => Promise<void>;
};

const CreateCustomerForm = ({ fetchCustomers }: CreateCustomerFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			phoneNumber: '',
			email: '',
			address: '',
			status: 1
		}
	});

	const openDialog = () => {
		setIsOpen(true);
	};

	const onSubmit = async (data: CustomerFormValues) => {
		try {
			setIsLoading(true);
			await addCustomer({ ...data, status: 1 });
			toast.success('Thêm khách hàng thành công!');
			if (fetchCustomers) {
				await fetchCustomers();
			}
			setIsOpen(false);
			form.reset();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error('Error adding customer:', error);
			toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='text-end mb-4 '>
				<Button className='bg-green-800 hover:bg-green-800/80' onClick={openDialog}>
					<Plus />
					Thêm
				</Button>
			</div>

			<Dialog
				open={isOpen}
				onOpenChange={open => {
					setIsOpen(open);
					if (!open) form.reset();
				}}
			>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogHeader>
							<DialogTitle className='text-xl font-bold'>Thêm Khách Hàng Mới</DialogTitle>
							<DialogDescription>Điền thông tin khách hàng để lưu vào hệ thống.</DialogDescription>
						</DialogHeader>{' '}
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1 py-2'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='space-y-1'>
										<FormLabel className='text-gray-700 font-semibold'>Họ và tên</FormLabel>
										<FormControl>
											<Input placeholder='Lê Hoàng Phát' {...field} />
										</FormControl>
										<FormMessage className='text-red-500 text-sm' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem className='space-y-1'>
										<FormLabel className='text-gray-700 font-semibold'>Số điện thoại</FormLabel>
										<FormControl>
											<Input placeholder='0338641606' {...field} />
										</FormControl>
										<FormMessage className='text-red-500 text-sm' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem className='space-y-1'>
										<FormLabel className='text-gray-700 font-semibold'>Email</FormLabel>
										<FormControl>
											<Input placeholder='example@gmail.com' {...field} />
										</FormControl>
										<FormMessage className='text-red-500 text-sm' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem className='space-y-1'>
										<FormLabel className='text-gray-700 font-semibold'>Địa chỉ</FormLabel>
										<FormControl>
											<Input placeholder='123 Đường Trần Hưng Đạo, Quận 1, TP.HCM' {...field} />
										</FormControl>
										<FormMessage className='text-red-500 text-sm' />
									</FormItem>
								)}
							/>

							<DialogFooter className='pt-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => setIsOpen(false)}
									className='mr-2'
									disabled={isLoading}
								>
									Hủy
								</Button>
								<Button type='submit' className='bg-green-800 hover:bg-green-900' disabled={isLoading}>
									{isLoading ? 'Đang lưu...' : 'Lưu'}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreateCustomerForm;
