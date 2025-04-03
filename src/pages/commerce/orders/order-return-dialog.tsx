import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftRight } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderReturnDialogProps {
	order: Order;
	onReturn: (orderId: string, reason: string) => void;
}

export const OrderReturnDialog = ({ order, onReturn }: OrderReturnDialogProps) => {
	const [reason, setReason] = useState('');
	const [open, setOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onReturn(order.id, reason);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' title='Trả hàng'>
					<ArrowLeftRight className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Trả hàng - Đơn hàng {order.orderNumber}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='reason'>Lý do trả hàng</Label>
						<Textarea
							id='reason'
							value={reason}
							onChange={e => setReason(e.target.value)}
							placeholder='Nhập lý do trả hàng...'
							required
						/>
					</div>
					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={() => setOpen(false)}>
							Hủy
						</Button>
						<Button type='submit' variant='destructive'>
							Xác nhận trả hàng
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
