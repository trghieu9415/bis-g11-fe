import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SalaryStructureDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const SalaryStructureDialog: React.FC<SalaryStructureDialogProps> = ({ isOpen, onClose }) => {
	const { allowances } = useSelector((state: RootState) => state.allowances);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogOverlay />
			<DialogContent className='min-w-[60vw]'>
				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>
				<div className='text-center border-b pb-4 mb-4 text-black'>
					<h1 className='text-lg font-bold'>CÔNG TY INVERSE</h1>
					<h2 className='text-lg font-bold'>CƠ CẤU LƯƠNG</h2>
					<p className='text-sm'>Số: 100/TB-INVERSE</p>
				</div>
				<Tabs defaultValue='salary-formula'>
					<div className='text-center mb-4'>
						<TabsList className=''>
							<TabsTrigger value='salary-formula'>Công thức tính lương</TabsTrigger>
							<TabsTrigger value='allowances'>Phụ cấp thai sản & nghỉ bệnh</TabsTrigger>
							<TabsTrigger value='allowancesFormCompany'>Phụ cấp từ công ty</TabsTrigger>
							<TabsTrigger value='tax'>Thuế</TabsTrigger>
							<TabsTrigger value='penalty'>Phạt</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value='salary-formula' className='min-h-[430px] max-h-[430px] overflow-y-auto pr-1'>
						<div className='text-gray-700 space-y-4'>
							<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
							<p className='!mt-1'>Giám đốc công ty Inverse thông báo về cơ cấu lương như sau:</p>
							<ul className='list-disc pl-6 space-y-4'>
								<li>
									<strong>Công thức tính lương:</strong>
									<div className='py-2 px-4 mt-2 bg-gray-100 rounded-lg text-base flex flex-col justify-center items-start'>
										<p className='text-sm'>
											<strong className='italic text-lg'>A</strong> = (lương cơ bản - hệ số lương) / số ngày làm việc
											tiêu chuẩn
										</p>
										<p className='text-sm'>
											<strong className='italic text-lg'>B</strong> = số ngày làm việc thực tế - số ngày nghỉ thai sản -
											số ngày nghỉ bệnh
										</p>
										<p className='text-sm'>
											<strong className='italic text-lg'>C</strong> = phụ cấp thai sản + phụ cấp nghỉ bệnh + phụ cấp từ
											công ty
										</p>
										<p className='text-sm'>
											<strong className='italic text-lg'>D</strong> = khoản phạt (bao gồm đi trễ, nghỉ không phép)
										</p>
										<div>
											<p className='text-sm'>
												<strong className='text-base'>Lương thực nhận</strong> ={' '}
												<strong className='italic text-lg'>A</strong> x <strong className='italic text-lg'>B</strong> +{' '}
												<strong className='italic text-lg'>C</strong> - thuế -{' '}
												<strong className='italic text-lg'>D</strong>
											</p>
										</div>
										<p className='mt-2 mx-auto text-center text-sm italic'>
											Chưa bao gồm: Giảm trừ gia cảnh bản thân & Giảm trừ gia cảnh người phụ thuộc{' '}
										</p>
									</div>
								</li>
							</ul>
							<div className='mt-6 border-t pt-4 text-center'>
								<p className='font-bold'>GIÁM ĐỐC</p>
								<p className='italic'>(đã ký)</p>
								<p className='font-bold'>Lữ Quang Minh</p>
							</div>
						</div>
					</TabsContent>
					<TabsContent value='allowances' className='min-h-[430px] max-h-[430px] overflow-y-auto pr-1'>
						<div className='text-gray-700 space-y-4'>
							<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
							<p className='!mt-1'>Giám đốc công ty Inverse thông báo về cơ cấu lương như sau:</p>
							<ul className='list-disc pl-6 space-y-4'>
								<li>
									<strong>Công thức tính phụ cấp thai sản:</strong>
									<div className='py-2 px-4 mt-2 bg-gray-100 rounded-lg text-base flex flex-col justify-center items-start'>
										<p className='text-sm'>
											<strong className='italic text-lg'>A</strong> = (bình quân 6 tháng trước đóng BHXH) / số ngày làm
											việc tiêu chuẩn
										</p>
										<p>
											<strong className='text-base'>Phụ cấp thai sản</strong> ={' '}
											<strong className='italic text-lg'>A</strong> x số ngày nghỉ thai sản
										</p>
									</div>
								</li>
								<li>
									<strong>Công thức tính phụ cấp nghỉ bệnh:</strong>
									<div className='py-2 px-4 mt-2 bg-gray-100 rounded-lg text-base flex flex-col justify-center items-start'>
										<p className='text-sm'>
											<strong className='italic text-lg'>A</strong> = (lương cơ bản x hệ số lương x số ngày nghỉ) / số
											ngày làm việc tiêu chuẩn
										</p>
										<p>
											<strong className='text-base'>Phụ cấp nghỉ bệnh</strong> ={' '}
											<strong className='italic text-lg'>A</strong> x ??%
										</p>
									</div>
								</li>
							</ul>
						</div>
					</TabsContent>
					<TabsContent value='allowancesFormCompany' className='min-h-[430px] max-h-[430px] overflow-y-auto pr-1'>
						<div className='text-gray-700 space-y-4'>
							<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
							<p className='!mt-1'>Giám đốc công ty Inverse thông báo về cơ cấu lương như sau:</p>
							<table className='min-w-full divide-y divide-gray-200 overflow-y-auto pr-1'>
								<thead className='bg-gray-100 sticky top-0 z-10'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Chức vụ
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Phụ cấp
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200 text-sm'>
									{allowances.map(allowance =>
										allowance.roleName.map((role, index) => (
											<tr key={`${allowance.id}-${index}`}>
												<td className='px-6 py-4 whitespace-nowrap'>{role}</td>
												<td className='px-6 py-4 whitespace-nowrap'>{allowance.allowance} VNĐ/tháng</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</TabsContent>
					<TabsContent value='tax' className='min-h-[430px] max-h-[430px] overflow-y-auto pr-1'>
						<div className='text-gray-700 space-y-4'>
							<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
							<p className='!mt-1'>Giám đốc công ty Inverse thông báo về các khoản thuế như sau:</p>
							<table className='min-w-full divide-y divide-gray-200 overflow-y-auto pr-1'>
								<thead className='bg-gray-100 sticky top-0 z-10'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											STT
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Các Khoản Trừ Vào Lương
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Phần trăm
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200 text-sm'>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>1</td>
										<td className='px-6 py-4 whitespace-nowrap '>Bảo Hiểm Bắt Buộc</td>
										<td className='px-6 py-4 whitespace-nowrap'></td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>1.1</td>
										<td className='px-6 py-4 whitespace-nowrap'>Bảo hiểm xã hội</td>
										<td className='px-6 py-4 whitespace-nowrap'>8%</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>1.2</td>
										<td className='px-6 py-4 whitespace-nowrap'>Bảo hiểm y tế</td>
										<td className='px-6 py-4 whitespace-nowrap'>1.5%</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>1.3</td>
										<td className='px-6 py-4 whitespace-nowrap'>Bảo hiểm thất nghiệp</td>
										<td className='px-6 py-4 whitespace-nowrap'>1%</td>
									</tr>
								</tbody>
							</table>
						</div>
					</TabsContent>
					<TabsContent value='penalty' className='min-h-[430px] max-h-[430px] overflow-y-auto pr-1'>
						<div className='text-gray-700 space-y-4'>
							<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
							<p className='!mt-1'>Giám đốc công ty Inverse thông báo về cơ cấu lương như sau:</p>
							<table className='min-w-full divide-y divide-gray-200 overflow-y-auto pr-1'>
								<thead className='bg-gray-100 sticky top-0 z-10'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Hình thức vi phạm
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Mức phạt
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200 text-sm'>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>Đi trễ từ 8h30 đến 10h00</td>
										<td className='px-6 py-4 whitespace-nowrap'>Trừ 12.5% ngày công</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>Đi trễ từ 10h00 đến 12h00</td>
										<td className='px-6 py-4 whitespace-nowrap'>Trừ 25% ngày công</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>Đi trễ từ 13h30 đến 14h00</td>
										<td className='px-6 py-4 whitespace-nowrap'>Trừ 60% ngày công</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>Đi trễ sau 14h00</td>
										<td className='px-6 py-4 whitespace-nowrap'>Trừ 100% ngày công</td>
									</tr>
									<tr>
										<td className='px-6 py-4 whitespace-nowrap'>Nghỉ không phép</td>
										<td className='px-6 py-4 whitespace-nowrap'>Trừ 100% ngày công</td>
									</tr>
								</tbody>
							</table>
						</div>
					</TabsContent>
				</Tabs>
				<Button onClick={onClose}>Đóng</Button>
			</DialogContent>
		</Dialog>
	);
};

export default SalaryStructureDialog;
