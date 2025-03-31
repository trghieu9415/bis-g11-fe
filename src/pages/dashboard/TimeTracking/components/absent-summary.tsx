import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AbsentSummaryProps {
	unpaidLeave: number;
	notCheckIn: number;
	notCheckOut: number;

	unpaidGTEorLTE: number;
	notCheckInGTEorLTE: number;
	notCheckOutGTEorLTE: number;
}

export default function AbsentSummary({
	unpaidLeave = 0,
	notCheckIn = 0,
	notCheckOut = 0,
	unpaidGTEorLTE = 0,
	notCheckInGTEorLTE = 0,
	notCheckOutGTEorLTE = 0
}: AbsentSummaryProps) {
	return (
		<Card className='px-2 py-4 bg-transparent shadow-none flex-1 bg-white'>
			<CardHeader className='pt-1 pb-6 px-1'>
				<CardTitle className='flex items-center gap-2'>📋 Tổng kết vắng mặt</CardTitle>
			</CardHeader>
			<CardContent className='grid grid-cols-3 gap-2 text-center p-2 text-sm'>
				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Không phép</p>
					<p className='text-lg font-bold text-start'>{unpaidLeave}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${unpaidGTEorLTE === 0 ? 'text-black' : ' text-red-500'}`}>
							{unpaidGTEorLTE > 0 && '+'}
							{unpaidGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>
				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Not check-in</p>
					<p className='text-lg font-bold text-start'>{notCheckIn}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${notCheckInGTEorLTE === 0 ? 'text-black' : ' text-red-500'}`}>
							{notCheckInGTEorLTE > 0 && '+'}
							{notCheckInGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>
				<div>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Not check-out</p>
					<p className='text-lg font-bold text-start'>{notCheckOut}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${notCheckOutGTEorLTE === 0 ? 'text-black' : ' text-red-500'}`}>
							{notCheckOutGTEorLTE > 0 && '+'}
							{notCheckOutGTEorLTE}{' '}
						</span>
						vs hôm qua
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
