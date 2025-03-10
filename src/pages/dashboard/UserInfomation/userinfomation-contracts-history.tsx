import { RootState, useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

export default function UserInfomationContractsHistory() {
	return (
		<div className='flex flex-col items-center justify-between flex-1 gap-4 h-full max-h-[50%]'>
			<div className='px-4 py-6 flex-1 w-full  border-gray-200 border-solid border rounded-md h-full overflow-y-auto'>
				<h1 className='text-lg font-bold uppercase text-center'>Lịch sử hợp đồng</h1>
				<Input className='mt-2 mb-4' placeholder='Tìm hợp đồng ở đây...' />
				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							CTR-1 - Nhân viên -{' '}
							{new Date('2024-03-05').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}{' '}
							-{' '}
							{new Date('2026-12-31').toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</AccordionTrigger>
						<AccordionContent>
							<p>
								<strong>Chức vụ:</strong> Nhân viên
							</p>
							<p>
								<strong>Lương cơ bản:</strong> 10,000,000 VND
							</p>
							<p>
								<strong>Hệ số lương:</strong> 1.2
							</p>
							<p>
								<strong>Ngày làm tiêu chuẩn:</strong> 20 ngày/tháng
							</p>
							<p className='flex gap-1'>
								<strong>Trạng thái:</strong>{' '}
								<span className='flex items-center text-green-600 font-bold'>
									<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
								</span>
								<span className='flex items-center text-red-500 font-bold'>
									<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
								</span>
							</p>
							<p>
								<strong>Ngày bắt đầu:</strong>{' '}
								{new Date('2024-03-05').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}{' '}
							</p>
							<p>
								<strong>Ngày kết thúc:</strong>{' '}
								{new Date('2026-12-31').toLocaleDateString('vi-VN', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
