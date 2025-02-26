import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HREmployeeForm({ employee, mode, onClose }) {
	let cardTitle = '';
	if (mode === 'view') {
		cardTitle = 'Thông tin nhân viên';
	} else if (mode === 'update') {
		cardTitle = 'Chỉnh sửa nhân viên';
	} else if (mode === 'delete') {
		cardTitle = 'Xóa nhân viên';
	}

	return (
		<Card className='min-w-[450px] max-w-lg mx-auto bg-white p-5 shadow-lg'>
			<CardHeader>
				<CardTitle>{cardTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div>
						<Label htmlFor='first_name'>First Name</Label>
						<Input
							id='first_name'
							defaultValue={employee?.first_name}
							disabled={mode === 'view'}
							className={mode === 'view' ? 'bg-gray-100 text-gray-500 outline-none ' : 'outline-none'}
						/>
					</div>

					<div>
						<Label htmlFor='last_name'>Last Name</Label>
						<Input
							id='last_name'
							defaultValue={employee?.last_name}
							disabled={mode === 'view'}
							className={mode === 'view' ? 'bg-gray-100 text-gray-500 outline-none ' : 'outline-none'}
						/>
					</div>

					<div className='flex justify-end gap-2'>
						<Button onClick={onClose} variant='secondary'>
							Cancel
						</Button>
						<Button>Save</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
