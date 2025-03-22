import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PresentSummaryProps {
	onTime: number;
	late: number;
	early: number;

	onTimeGTEorLTE: number;
	lateGTEorLTE: number;
	earlyGTEorLTE: number;
}

export default function PresentSummary({
	onTime = 0,
	late = 0,
	early = 0,
	onTimeGTEorLTE = 0,
	lateGTEorLTE = 0,
	earlyGTEorLTE = 0
}: PresentSummaryProps) {
	return (
		<Card className='px-2 py-4 bg-transparent shadow-none flex-2'>
			<CardHeader className='pt-1 pb-6 px-1'>
				<CardTitle className='flex items-center gap-2'>📋 Tổng kết chấm công</CardTitle>
			</CardHeader>
			<CardContent className='grid grid-cols-3 gap-2 text-center p-2 text-sm'>
				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Đúng giờ</p>
					<p className='text-lg font-bold text-start'>{onTime}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${onTimeGTEorLTE === 0 ? 'text-black' : ' text-blue-500'}`}>
							{onTimeGTEorLTE > 0 && '+'}
							{onTimeGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>

				<div className='border-r pr-2'>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Đi trễ</p>
					<p className='text-lg font-bold text-start'>{late}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${lateGTEorLTE === 0 ? 'text-black' : ' text-red-500'}`}>
							{lateGTEorLTE > 0 && '+'}
							{lateGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>

				<div>
					<p className='text-gray-500 flex items-center justify-start gap-1 font-bold'>Đi sớm</p>
					<p className='text-lg font-bold text-start'>{early}</p>
					<p className='text-sm text-gray-500 text-start'>
						<span className={`${earlyGTEorLTE === 0 ? 'text-black' : ' text-blue-500'}`}>
							{earlyGTEorLTE > 0 && '+'}
							{earlyGTEorLTE}{' '}
						</span>{' '}
						vs hôm qua
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
