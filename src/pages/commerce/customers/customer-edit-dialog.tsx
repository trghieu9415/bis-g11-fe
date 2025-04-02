import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { Customer } from '@/types/customer';

interface CustomerEditDialogProps {
	customer: Customer;
	onEdit: (customer: Customer) => void;
}

export const CustomerEditDialog = ({ customer, onEdit }: CustomerEditDialogProps) => {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<Customer>(customer);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onEdit(formData);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' title='Chỉnh sửa'>
					<Pencil className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='customerCode'>Mã khách hàng</Label>
							<Input
								id='customerCode'
								value={formData.customerCode}
								onChange={e => setFormData(prev => ({ ...prev, customerCode: e.target.value }))}
								disabled
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='fullName'>Họ tên</Label>
							<Input
								id='fullName'
								value={formData.fullName}
								onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>Số điện thoại</Label>
							<Input
								id='phone'
								value={formData.phone}
								onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
								required
							/>
						</div>
						<div className='col-span-2 space-y-2'>
							<Label htmlFor='address'>Địa chỉ</Label>
							<Textarea
								id='address'
								value={formData.address}
								onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='status'>Trạng thái</Label>
							<Select
								value={formData.status}
								onValueChange={value => setFormData(prev => ({ ...prev, status: value as Customer['status'] }))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='active'>Đang hoạt động</SelectItem>
									<SelectItem value='inactive'>Không hoạt động</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={() => setOpen(false)}>
							Hủy
						</Button>
						<Button type='submit'>Lưu thay đổi</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
