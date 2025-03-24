import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AwaySummaryProps {
	paidLeave: number;
	sickLeave: number;
	maternityLeave: number;

	paidLeaveGTEorLTE: number;
	sickLeaveGTEorLTE: number;
	maternityLeaveGTEorLTE: number;
}

export default function AwaySummary({
	paidLeave = 0,
	sickLeave = 0,
	maternityLeave = 0,
	paidLeaveGTEorLTE = 0,
	sickLeaveGTEorLTE = 0,
	maternityLeaveGTEorLTE = 0
}: AwaySummaryProps) {
	return (
		<Card className='px-2 py-4 bg-transparent shadow-none flex-1 bg-white'>
			<CardHeader className='pt-1 pb-6 px-1'>
				<CardTitle className='flex items-center gap-2'>📋 Tổng kết vắng có phép</CardTitle>
			</CardHeader>
			<CardContent className='grid grid-cols-3 gap-2 text-center p-2 text-sm'>
				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Nghỉ phép</p>
					<p className='text-lg font-bold text-start'>{paidLeave}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${paidLeaveGTEorLTE === 0 ? 'text-black' : ' text-red-500'}`}>
							{paidLeaveGTEorLTE > 0 && '+'}
							{paidLeaveGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>

				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Nghỉ bệnh</p>
					<p className='text-lg font-bold text-start'>{sickLeave}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${sickLeaveGTEorLTE === 0 ? 'text-black' : ' text-blue-500'}`}>
							{sickLeaveGTEorLTE > 0 && '+'}
							{sickLeaveGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>

				<div>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Nghỉ thai sản</p>
					<p className='text-lg font-bold text-start'>{maternityLeave}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${sickLeaveGTEorLTE === 0 ? 'text-black' : ' text-blue-500'}`}>
							{maternityLeaveGTEorLTE > 0 && '+'}
							{maternityLeaveGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
