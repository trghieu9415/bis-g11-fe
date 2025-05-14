import { useParams } from 'react-router-dom';
import AllLeaveRequestsTable from './LeaveRequests/allLeaveRequests-table';

export default function AllLeaveRequests() {
	const { type } = useParams();
	const leaveTypeKey = type?.toLowerCase();

	return (
		<div className='flex flex-col w-full'>
			<h1 className='text-lg font-bold py-4 uppercase'>
				Danh sách đơn xin nghỉ{' '}
				{leaveTypeKey === 'sick'
					? 'bệnh'
					: leaveTypeKey === 'paid'
						? 'phép'
						: leaveTypeKey === 'maternity'
							? 'thai sản'
							: ''}
			</h1>
			<div className='mb-2'>
				<AllLeaveRequestsTable />
			</div>
		</div>
	);
}
