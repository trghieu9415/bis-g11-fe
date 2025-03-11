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

export default function CreateSupplier() {
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
						<DialogTitle>Tạo nhà cung cấp mới</DialogTitle>
					</DialogHeader>
					<div className='grid gap-12 py-4'>
						<div className='grid grid-cols-2 items-center gap-4'>
							<div>
								<Label htmlFor='name' className='text-right font-bold'>
									Tên nhà cung cấp
								</Label>
								<Input id='name' type='text' className='col-span-3 mt-1' />
							</div>
							<div>
								<Label className='text-right font-bold'>Số điện thoại</Label>
								<Input id='phone' type='text' className='col-span-3 mt-1' />
							</div>
						</div>
						<div className='grid items-center gap-4'>
							<div>
								<Label htmlFor='address' className='text-center font-bold'>
									Địa chỉ
								</Label>
								<Input id='address' type='text' className='w-full col-span-3 mt-1' />
							</div>
						</div>
						<div className='grid grid-cols-2 items-center gap-4'>
							<div>
								<Label htmlFor='email' className='text-right font-bold'>
									Email
								</Label>
								<Input id='name' type='text' className='col-span-3 mt-1' />
							</div>
							<div>
								<Label className='text-right font-bold'>Chiết khấu (%)</Label>
								<Input id='percentage' type='text' className='col-span-3 mt-1' />
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
				</DialogContent>
			</Dialog>
		</div>
	);
}
