import { Input } from './ui/input';

function Header() {
	return (
		<div className='flex w-full justify-between p-2 rounded-t-lg bg-gray-100'>
			<div className='flex w-full'>
				<Input type='text' className='w-[30%] px-2 ring-0 outline-none h-8' placeholder='Tìm kiếm...' />
			</div>
		</div>
	);
}

function TableHeader() {
	return (
		<div className='flex w-full border-b-2 border-gray-100 py-2'>
			<div className='flex w-full justify-between'>
				<div className='m-2'>Tên</div>
				<div className='m-2'>Ngày sinh</div>
				<div className='m-2'>Số điện thoại</div>
				<div className='m-2'>Email</div>
			</div>
		</div>
	);
}

function Body() {
	return (
		<div className='flex w-full overflow-x-auto py-4 border-l-2 border-r-2 border-gray-100'>
			<TableHeader />
		</div>
	);
}

export default function CustomTable() {
	return (
		<div className='text-xs border-2 p-4 rounded-lg'>
			<Header />
			<Body />
		</div>
	);
}
