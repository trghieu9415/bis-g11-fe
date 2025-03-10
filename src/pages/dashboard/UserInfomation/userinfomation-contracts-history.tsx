import { RootState, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ListRestart, HelpCircle, Info } from 'lucide-react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction
} from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { fetchAllContractsByUserId } from '@/redux/slices/contractsByUserIDSlice';
import { fileURLToPath } from 'url';

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

export default function UserInfomationContractsHistory() {
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

			console.log(filteredContracts);

			setFilteredContracts(filteredContracts);
		}
	};

	const handleReset = () => {
		reset();
		setFilteredContracts(contracts);
	};

	return (
		<div className='flex flex-col items-center justify-between flex-1 gap-4 h-full max-h-[100%]'>
			<div className='px-4 py-6 flex-1 w-full  border-gray-200 border-solid border rounded-md h-full overflow-y-auto'>
				<h1 className='text-lg font-bold uppercase text-center'>Lịch sử hợp đồng</h1>
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
													className='!w-[50vw] !max-w-none !max-h-[90vh] h-[570px]'
													onOpenAutoFocus={e => e.preventDefault()}
												>
													<DialogHeader>
														<DialogTitle>Nội dung đơn xin nghỉ phép</DialogTitle>
														<DialogDescription>
															Chi tiết về đơn xin nghỉ phép của bạn, bao gồm thời gian nghỉ, lý do và trạng thái phê
															duyệt.
														</DialogDescription>
													</DialogHeader>

													{/* Nội dung chi tiết hợp đồng */}

													<div
														className={`flex items-center ${item.status === 2 ? 'justify-between' : 'justify-end'}  gap-2`}
													>
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
