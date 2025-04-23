import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ListRestart, HelpCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { fetchAllContractsByUserId } from '@/redux/slices/contractsByUserIDSlice';

interface ApiResponse {
	id: number;
	idString: string;
	userId: number;
	fullName: string;
	baseSalary: number;
	status: number;
	startDate: string;
	endDate: string;
	expiryDate: string;
	roleName: string;
	levelName: string;
	salaryCoefficient: number;
}

export default function UserInformationContractsHistory() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [filteredContracts, setFilteredContracts] = useState<ApiResponse[]>([]);
	const [openItem, setOpenItem] = useState('');

	const dispatch = useAppDispatch();
	const { user } = useSelector((state: RootState) => state.user);
	const { contracts } = useSelector((state: RootState) => state.contractsByUserID);

	const {
		register,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		setValue,
		reset,
		trigger,
		formState: { errors }
	} = useForm({
		defaultValues: {
			startDate: '',
			endDate: ''
		}
	});

	const formData = watch();

	useEffect(() => {
		if (contracts?.length == 0 && user?.id) {
			dispatch(fetchAllContractsByUserId(user.id));
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (contracts && contracts.length > 0) {
			setFilteredContracts(contracts);
		}
	}, [contracts]);

	useEffect(() => {
		if (filteredContracts.length > 0) {
			setOpenItem(`item-${filteredContracts[0].id}`);
		}
	}, [filteredContracts]);

	const handleSearch = async () => {
		const fieldsToValidate = ['startDate', 'endDate'] as const;
		const isValid = await trigger(fieldsToValidate);

		if (isValid) {
			const filteredContracts = contracts.filter(item => {
				const itemStartDate = new Date(item.startDate);
				const itemEndDate = new Date(item.endDate);
				const filterStartDate = formData.startDate ? new Date(formData.startDate) : null;
				const filterEndDate = formData.endDate ? new Date(formData.endDate) : null;

				return (
					(!filterStartDate || itemStartDate >= filterStartDate) && (!filterEndDate || itemEndDate <= filterEndDate)
				);
			});

			setFilteredContracts(filteredContracts);
		}
	};

	const handleReset = () => {
		reset();
		setFilteredContracts(contracts);
	};

	return (
		<div className='bg-white flex flex-col items-center justify-between flex-1 gap-4 h-full max-h-[100%]'>
			<div className='px-4 py-6 flex-1 w-full  border-gray-200 border-solid border rounded-md h-full overflow-y-auto'>
				<h1 className='text-base font-bold uppercase text-center'>Lịch sử hợp đồng</h1>
				<div className='flex justify-center items-center gap-2 mt-2 '>
					<div className='flex gap-2 mb-4'>
						<div>
							<Input
								type='date'
								placeholder='Từ ngày'
								{...register('startDate', { required: 'Vui lòng chọn ngày bắt đầu' })}
							/>
							{errors.startDate && <p className='text-red-500 text-sm text-start mb-2'>{errors.startDate.message}</p>}
						</div>

						<div>
							<Input
								type='date'
								placeholder='Đến ngày'
								disabled={!formData.startDate}
								{...register('endDate', {
									validate: value => {
										const startDate = watch('startDate');

										if (!startDate || !value || value >= startDate) {
											return true;
										}

										return 'Ngày kết thúc phải sau ngày bắt đầu';
									}
								})}
							/>
							{errors.endDate && <p className='text-red-500 text-sm text-start mb-2'>{errors.endDate.message}</p>}
						</div>
						<Button variant='outline' onClick={handleReset}>
							<ListRestart />
						</Button>
						<Button onClick={handleSearch}>Tìm kiếm</Button>
					</div>
				</div>
				<Accordion
					type='single'
					collapsible
					className='w-full'
					value={openItem}
					onValueChange={value => setOpenItem(value)}
				>
					{filteredContracts.length > 0 ? (
						filteredContracts.map((item, index) => {
							return (
								<AccordionItem value={`item-${item.id}`} key={index}>
									<AccordionTrigger>
										{item.idString}
										{' - '}
										{new Date(item.startDate).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric'
										})}
										{' đến '}
										{new Date(item.endDate).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric'
										})}
										{item.status === 0 ? (
											<span className='flex items-center text-red-500 font-bold flex-1 justify-end mr-2 float-end'>
												<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
											</span>
										) : item.status === 1 ? (
											<span className='flex items-center text-green-600 font-bold flex-1 justify-end mr-2 float-end'>
												<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
											</span>
										) : (
											<span className='flex items-center text-gray-400 font-bold flex-1 justify-end mr-2 float-end'>
												<HelpCircle className='w-4 h-4 text-gray-400 mr-1' /> Không xác định
											</span>
										)}
									</AccordionTrigger>
									<AccordionContent>
										<p>
											<strong>Chức vụ:</strong> {item.roleName}
										</p>
										<p>
											<strong>Cấp bậc:</strong> {item.levelName}
										</p>
										<p>
											<strong>Lương cơ bản:</strong> {item.baseSalary.toLocaleString('en-US') + 'VNĐ'}
										</p>
										<p>
											<strong>Hệ số lương:</strong> {item.salaryCoefficient}
										</p>
										{/* <p className='flex gap-1'>
										<strong>Trạng thái:</strong>{' '}
										<span className='flex items-center text-green-600 font-bold'>
											<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
										</span>
										<span className='flex items-center text-red-500 font-bold'>
											<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
										</span>
									</p> */}
										{/* <p>
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
									</p> */}
										<div className='flex items-center justify-end gap-1 mt-4'>
											<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
												<DialogTrigger asChild>
													<Button className='border-none h-[32px] py-[6px] px-[8px] w-full justify-start items-center bg-gray-100 text-black hover:bg-gray-200'>
														<Info /> Chi tiết
													</Button>
												</DialogTrigger>
												<DialogContent
													className='!w-[70vw] !max-w-none !max-h-[90vh] h-[800px] flex items-start justify-start flex-col'
													onOpenAutoFocus={e => e.preventDefault()}
												>
													<DialogHeader>
														<DialogTitle>Nội dung hợp đồng lao động</DialogTitle>
														<DialogDescription>
															Chi tiết về hợp đồng lao động của bạn, bao gồm các điều khoản công việc, quyền lợi, nghĩa
															vụ của người lao động và người sử dụng lao động, mức lương và thời gian làm việc.
														</DialogDescription>
													</DialogHeader>

													<div className='flex flex-col gap-2 w-full flex-1'>
														{item.status === 0 ? (
															<span className='flex items-center text-red-500 font-bold flex-1 justify-end mr-2 float-end'>
																<XCircle className='w-4 h-4 text-red-500 mr-1' /> Hết hạn
															</span>
														) : item.status === 1 ? (
															<span className='flex items-center text-green-600 font-bold flex-1 justify-end mr-2 float-end'>
																<CheckCircle className='w-4 h-4 text-green-600 mr-1' /> Còn hiệu lực
															</span>
														) : (
															<span className='flex items-center text-gray-400 font-bold flex-1 justify-end mr-2 float-end'>
																<HelpCircle className='w-4 h-4 text-gray-400 mr-1' /> Không xác định
															</span>
														)}
														<div className='h-full'>
															<Tabs defaultValue='general-info' className='text-center h-[460px] overflow-y-auto'>
																<TabsList className='mb-1'>
																	<TabsTrigger value='general-info'>Thông tin chung</TabsTrigger>
																	<TabsTrigger value='term-job'>Điều khoản</TabsTrigger>
																</TabsList>
																<TabsContent value='general-info' className='text-start'>
																	<h2 className='font-bold text-base border-b-[1px] mb-2 pb-1'>Bên sử dụng lao động</h2>
																	<p className='ml-2'>
																		<strong>Chúng tôi, một bên là: </strong>
																		Ông Lữ Quang Minh
																	</p>
																	<p className='ml-2'>
																		<strong>Đại diện cho: </strong>
																		Công ty TNHH INKVERSE
																	</p>
																	<p className='ml-2'>
																		<strong>Chức vụ: </strong>
																		Giám đốc
																	</p>
																	<p className='ml-2'>
																		<strong>Địa chỉ: </strong>
																		118/1 Nguyên Hồng, Phường 1, Quận Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam
																	</p>
																	<p className='ml-2'>
																		<strong>Điện thoại: </strong>
																		0931814480
																	</p>

																	<h2 className='font-bold text-base mt-4 border-b-[1px] mb-2 pb-1'>Bên lao động</h2>
																	<p className='ml-2'>
																		<strong>Họ và tên: </strong>
																		{user.fullName}
																	</p>
																	<p className='ml-2'>
																		<strong>Ngày sinh: </strong>
																		{user.dateOfBirth}
																	</p>
																	<p className='ml-2'>
																		<strong>Địa chỉ: </strong>
																		{user.address}
																	</p>
																	<p className='ml-2'>
																		<strong>Số điện thoại: </strong>
																		{user.phoneNumber}
																	</p>
																</TabsContent>
																<TabsContent value='term-job' className='text-start'>
																	<Accordion type='single' collapsible>
																		<AccordionItem value='item-1'>
																			<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																				Điều 1: Điều khoản và công việc
																			</AccordionTrigger>
																			<AccordionContent className='ml-2 text-base'>
																				<p className='ml-2'>
																					<strong>Loại hợp đồng: </strong>
																					Xác định thời hạn từ {item.startDate} đến {item.endDate}
																				</p>
																				<p className='ml-2'>
																					<strong>Địa điểm làm việc: </strong>
																					Công ty TNHH INKVERSE
																				</p>
																				<p className='ml-2'>
																					<strong>Chức vụ/chức danh chuyên môn: </strong>
																					{item.roleName} - {item.levelName}
																				</p>
																				<p className='ml-2'>
																					<strong>Mô tả công việc: </strong>
																					Các công việc theo sự phân công của lãnh đạo Công ty
																				</p>
																			</AccordionContent>
																		</AccordionItem>
																		<AccordionItem value='item-2'>
																			<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																				Điều 2: Thời Gian Làm Việc
																			</AccordionTrigger>
																			<AccordionContent className='ml-2 text-base'>
																				<p className='ml-2'>Thời gian làm việc theo quy định của công ty.</p>
																			</AccordionContent>
																		</AccordionItem>
																		<AccordionItem value='item-3'>
																			<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																				Điều 3: Quyền Lợi và Nghĩa Vụ của Người Lao Động
																			</AccordionTrigger>
																			<AccordionContent className='ml-2 text-base'>
																				<Accordion type='single' collapsible>
																					<AccordionItem value='item-3-1'>
																						<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																							Điều 3.1: Quyền lợi
																						</AccordionTrigger>
																						<AccordionContent className='ml-2 text-base'>
																							<p className='ml-2'>
																								<strong>Lương cơ bản: </strong>
																								{item.baseSalary.toLocaleString('en-US') + 'VNĐ'}
																							</p>
																							<p className='ml-2'>
																								<strong>Hệ số lương: </strong>
																								{item.salaryCoefficient}
																							</p>
																							<p className='ml-2'>
																								<strong>Lương Gross: </strong>
																								{(item.baseSalary * item.salaryCoefficient).toLocaleString('en-US') +
																									'VNĐ'}
																							</p>
																							<p className='ml-2'>
																								<strong>Hình thức trả lương: </strong>
																								Chuyển khoản vào ngày 5 của tháng kế tiếp.
																							</p>
																							<p className='ml-2'>
																								<strong>Tăng lương: </strong>
																								Theo quy định của công ty.
																							</p>
																							<p className='ml-2'>
																								<strong>Thưởng: </strong>
																								Theo quy định của công ty.
																							</p>
																							<p className='ml-2'>
																								<strong>Chế độ bảo hiểm: </strong>
																								Bảo hiểm xã hội và y tế theo quy định của pháp luật.
																							</p>
																						</AccordionContent>
																					</AccordionItem>
																					<AccordionItem value='item-3-2'>
																						<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																							Điều 3.2: Nghĩa vụ
																						</AccordionTrigger>
																						<AccordionContent className='ml-2 text-base'>
																							<p className='ml-2'>
																								Hoàn thành công việc được giao và bảo vệ tài sản của công ty.
																							</p>
																							<p className='ml-2'>
																								Tuân thủ quy định của công ty và thực hiện các cam kết trong hợp đồng.
																							</p>
																						</AccordionContent>
																					</AccordionItem>
																				</Accordion>
																			</AccordionContent>
																		</AccordionItem>
																		<AccordionItem value='item-4'>
																			<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																				Điều 4: Quyền và Nghĩa Vụ của Người Sử Dụng Lao Động
																			</AccordionTrigger>
																			<AccordionContent className='ml-2 text-base'>
																				<Accordion type='single' collapsible>
																					<AccordionItem value='item-4-1'>
																						<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																							Điều 4.1: Nghĩa vụ
																						</AccordionTrigger>
																						<AccordionContent className='ml-2 text-base'>
																							<p className='ml-2'>
																								Đảm bảo công việc và các quyền lợi của người lao động theo hợp đồng.
																							</p>
																							<p className='ml-2'>
																								Thanh toán đầy đủ các chế độ và quyền lợi cho người lao động đúng hạn.
																							</p>
																						</AccordionContent>
																					</AccordionItem>
																					<AccordionItem value='item-4-2'>
																						<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																							Điều 4.2: Quyền hạn
																						</AccordionTrigger>
																						<AccordionContent className='ml-2 text-base'>
																							<p className='ml-2'>
																								Có quyền chấm dứt hợp đồng trong trường hợp người lao động vi phạm nội
																								quy công ty.
																							</p>
																						</AccordionContent>
																					</AccordionItem>
																				</Accordion>
																			</AccordionContent>
																		</AccordionItem>
																		<AccordionItem value='item-5'>
																			<AccordionTrigger className='font-bold text-base border-b-[1px] mb-2 pb-1'>
																				Điều 5: Điều Khoản Chung
																			</AccordionTrigger>
																			<AccordionContent className='ml-2 text-base'>
																				<p className='ml-2'>Hợp đồng được làm thành 2 bản, mỗi bên giữ 1 bản.</p>
																				<p className='ml-2'>Thông Tin Thêm</p>
																				<p className='ml-4'>
																					<strong>Mã hợp đồng: </strong>
																					{item.idString}
																				</p>
																				<p className='ml-4'>
																					<strong>Ngày bắt đầu: </strong>
																					{item.startDate}
																				</p>
																				<p className='ml-4'>
																					<strong>Ngày kết thúc: </strong>
																					{item.endDate}
																				</p>
																				<p className='ml-4'>
																					<strong>Mức lương cơ bản: </strong>
																					{item.baseSalary.toLocaleString('en-US') + 'VNĐ'}
																				</p>
																				<p className='ml-4'>
																					<strong>Hệ số lương: </strong>
																					{item.salaryCoefficient}
																				</p>
																			</AccordionContent>
																		</AccordionItem>
																	</Accordion>
																</TabsContent>
															</Tabs>
														</div>
													</div>

													<div className={`flex items-center justify-end gap-2 w-full`}>
														<Button
															onClick={() => setIsDialogOpen(false)}
															className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-800 transition '
														>
															Thoát
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										</div>
									</AccordionContent>
								</AccordionItem>
							);
						})
					) : (
						<p className='text-center text-gray-500 py-4'>Không có hợp đồng</p>
					)}
				</Accordion>
			</div>
		</div>
	);
}
