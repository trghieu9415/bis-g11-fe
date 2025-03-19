import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, IdCard, KeyRound, Mail, Map, Phone } from 'lucide-react';

export default function CustomerZone() {
	return (
		<div className='flex flex-col w-full gap-y-3 p-3 border-t border-[#d1d1d1]'>
			<div className='grid grid-cols-3 w-full gap-x-5'>
				<div className='flex flex-col gap-y-2 w-full'>
					<span className='text-sm flex gap-x-1 items-center'>
						<KeyRound size={20} strokeWidth={0.75} />
						ID khách hàng
					</span>
					<Input disabled />
				</div>
				<div className='flex flex-col gap-y-2 w-full'>
					<span className='text-sm flex gap-x-1 items-center'>
						<IdCard size={20} strokeWidth={0.75} />
						Họ và tên
					</span>
					<Input />
				</div>
				<div className='flex flex-col gap-y-2 w-full'>
					<span className='text-sm flex gap-x-1 items-center'>
						<Phone size={20} strokeWidth={0.75} />
						Số điện thoại
					</span>
					<Input />
				</div>
			</div>
			<div className='grid grid-cols-4 w-full gap-x-5'>
				<div className='flex flex-col gap-y-2'>
					<span className='text-sm flex gap-x-1 items-center'>
						<Mail size={20} strokeWidth={0.75} />
						Email liên lạc
					</span>
					<Input />
				</div>
				<div className='flex flex-col gap-y-2 col-span-2'>
					<span className='text-sm flex gap-x-1 items-center'>
						<Map size={20} strokeWidth={0.75} />
						Địa chỉ
					</span>
					<Input />
				</div>
				<div className='flex items-end'>
					<Button variant='outline' className='w-full hover:bg-green-800 hover:text-white'>
						<Download size={20} />
						Lưu khách hàng
					</Button>
				</div>
			</div>
		</div>
	);
}
