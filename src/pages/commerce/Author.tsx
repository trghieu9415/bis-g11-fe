import AuthorNew from './Warehouse Management/Author/AuthorNew';
import AuthorTable from './Warehouse Management/Author/AuthorTable';

const Author = () => {
	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>Danh sách tác giả</h1>
			<AuthorNew />
			<div className='mb-2'>
				<AuthorTable />
			</div>
		</div>
	);
};

export default Author;
