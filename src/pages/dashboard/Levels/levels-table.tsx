import { useState } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCheck, CheckCircle, ChevronDown, ChevronUp, CircleOff, Ellipsis, Plus, XCircle } from 'lucide-react';

import { fetchRoles } from '@/redux/slices/rolesSlice';
import { useAppDispatch } from '@/redux/store';
import { addLevel, deleteLevel, updateLevel } from '@/services/levelService';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ResSeniority {
	id: number;
	idString: string;
	levelName: string;
	description: string;
	salaryCoefficient: number;
	status: number;
	roleId: number;
}

type Role = {
	id: number;
	name: string;
	description: string;
	status: number;
	resSeniority: ResSeniority[];
};

type Level = {
	id: number;
	idString: string;
	levelName: string;
	description: string;
	salaryCoefficient: string | number;
	status: number;
};

interface NewLevel {
	levelName: string;
	description: string;
	salaryCoefficient: number;
}

type RolesDialogProps = {
	selectedRole: Role | null;
	mode: string;
};

export default function LevelsTable({ selectedRole, mode }: RolesDialogProps) {
	const [isShowAdd, setIsShowAdd] = useState(false);
	const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [changeValueLevel, setChangeValueLevel] = useState({
		description: '',
		name: '',
		status: -1,
		salaryCoefficient: 0.0
	});

	const dispatch = useAppDispatch();
	const {
		register,
		formState: { errors },
		reset,
		watch,
		trigger
	} = useForm<NewLevel>({
		defaultValues: {
			levelName: '',
			description: '',
			salaryCoefficient: 0.0
		}
	});

	const formData = watch();

	const handleAddLevel = async (level: NewLevel) => {
		try {
			const fieldsToValidate = ['levelName', 'description', 'salaryCoefficient'] as const;
			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				const levelData = {
					levelName: level?.levelName,
					description: level?.description,
					salaryCoefficient:
						typeof level?.salaryCoefficient === 'string'
							? parseFloat(level.salaryCoefficient)
							: (level?.salaryCoefficient ?? 0),
					roleId: selectedRole?.id,
					status: 2
				};
				const res = await addLevel(levelData);
				// @ts-expect-error - exception success attr
				if (res.success) {
					toast.success('Thêm thông tin cấp bậc thành công!');
					dispatch(fetchRoles());
					setSelectedLevel({
						id: -1,
						idString: '',
						levelName: '',
						description: '',
						salaryCoefficient: '-1',
						status: -1
					});
					reset();
				}
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 409) {
				toast.error(
					(err.response.data as { error?: string }).error || 'Lỗi 409: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy cấp bậc.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleUpdateLevel = async (levelID: number, level: Level) => {
		try {
			const levelData = {
				levelName: level?.levelName,
				description: level?.description,
				salaryCoefficient:
					typeof level?.salaryCoefficient === 'string'
						? parseFloat(level.salaryCoefficient)
						: (level?.salaryCoefficient ?? 0),
				roleId: selectedRole?.id,
				status: level?.status
			};
			const res = await updateLevel(levelID, levelData);
			// @ts-expect-error - exception success attr
			if (res.success) {
				toast.success('Cập nhật thông tin cấp bậc thành công!');
				dispatch(fetchRoles());
				setSelectedLevel({
					id: -1,
					idString: '',
					levelName: '',
					description: '',
					salaryCoefficient: '-1',
					status: -1
				});
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy cấp bậc.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	const handleDeleteLevel = async (levelID: number) => {
		try {
			const res = await deleteLevel(levelID);
			// @ts-expect-error - exception success attr
			if (res.success) {
				toast.success('Xóa cấp bậc thành công!');
				dispatch(fetchRoles());
				setSelectedLevel({
					id: -1,
					idString: '',
					levelName: '',
					description: '',
					salaryCoefficient: '-1',
					status: -1
				});
				setIsDialogOpen(false);
			}
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 400) {
				toast.error(
					(err.response.data as { message?: string }).message || 'Lỗi 400: Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.'
				);
			} else if (err.response?.status === 404) {
				toast.error('Lỗi 404: Không tìm thấy cấp bậc.');
			} else if (err.response?.status === 500) {
				toast.error('Lỗi 500: Lỗi máy chủ, vui lòng thử lại sau.');
			} else {
				toast.error(`Lỗi từ server: ${err.response?.status} - ${err.message}`);
			}
		}
	};

	return (
		<div className='mt-2'>
			<div>
				<div className='flex items-center justify-between'>
					<h3 className='text-base font-semibold'>Danh sách cấp bậc</h3>
					{mode === 'edit' && !isShowAdd ? (
						<ChevronDown className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
					) : (
						mode === 'edit' && <ChevronUp className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
					)}
				</div>
				{mode === 'edit' && isShowAdd && selectedRole?.status === 1 ? (
					<>
						<div className='mt-1 grid grid-cols-2 gap-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label htmlFor='level-id' className='mb-1 w-full text-start text-sm font-semibold'>
										Tên cấp bậc
									</label>
									<Input
										id='level-id'
										type='text'
										className='w-full'
										{...register('levelName', {
											required: 'Vui lòng tên cấp bậc',
											minLength: {
												value: 3,
												message: 'Tên cấp bậc phải có ít nhất 3 ký tự'
											}
										})}
									/>
									{errors.levelName && <p className='text-sm text-red-500'>{errors.levelName.message}</p>}
								</div>
								<div>
									<label htmlFor='level-salary-coefficient' className='mb-1 w-full text-start text-sm font-semibold'>
										Hệ số lương
									</label>
									<Input
										id='level-salary-coefficient'
										type='text'
										className='w-full'
										{...register('salaryCoefficient', {
											required: 'Vui lòng nhập hệ số lương',
											validate: value => {
												const numberValue = typeof value === 'string' ? parseFloat(value) : value;
												if (isNaN(numberValue) || numberValue <= 0) {
													return 'Hệ số lương phải lớn hơn 0';
												}
												if (!/^\d+(\.\d{1,1})?$/.test(value.toString())) {
													return 'Chỉ chấp nhận số nguyên hoặc số thực (ví dụ: 1.1)';
												}
												return true;
											}
										})}
									/>
									{errors.salaryCoefficient && (
										<p className='text-sm text-red-500'>{errors.salaryCoefficient.message}</p>
									)}
								</div>
							</div>
							<div>
								<label htmlFor='level-description' className='mb-1 w-full text-start text-sm font-semibold'>
									Mô tả
								</label>
								<Input
									id='level-description'
									type='text'
									className='w-full'
									{...register('description', {
										required: 'Vui lòng nhập mô tả',
										minLength: {
											value: 3,
											message: 'Mô tả phải có ít nhất 3 ký tự'
										}
									})}
								/>
								{errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
							</div>
						</div>
						<div className='mb-2 h-[40px]'>
							<Button
								className='float-end mt-2 bg-green-800 hover:bg-green-900'
								onClick={() => handleAddLevel(formData)}
							>
								<Plus />
								Thêm
							</Button>
						</div>
					</>
				) : (
					mode === 'edit' &&
					isShowAdd && (
						<>
							<span className='text-center'>
								<p className='my-2'>
									Vui lòng cập nhật sang trạng thái <strong>"Hoạt động"</strong> để có thể thêm cấp bậc
								</p>
							</span>
						</>
					)
				)}
			</div>
			<div className={`overflow-y-auto ${isShowAdd ? 'max-h-[300px]' : 'max-h-[400px]'} pr-1`}>
				<Table className='mt-2 min-w-full table-fixed border border-gray-300'>
					<TableHeader className='bg-gray-100'>
						<TableRow>
							<TableCell className='w-20 border border-gray-300 px-2 py-2 text-center'>ID</TableCell>
							<TableCell className='w-80 border border-gray-300 px-2 py-2 text-center'>Mô tả</TableCell>
							<TableCell className='border border-gray-300 px-2 py-2 text-center'>Tên cấp bậc</TableCell>
							<TableCell className='min-w-[160px] border border-gray-300 px-2 py-2 text-center'>Trạng thái</TableCell>
							<TableCell className='w-28 border border-gray-300 px-2 py-2 text-center'>Hệ số lương</TableCell>
							{mode === 'edit' && (
								<TableCell className='w-20 border border-gray-300 px-2 py-2 text-center'>Thao tác</TableCell>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{selectedRole?.resSeniority && selectedRole.resSeniority.length > 0 && selectedRole.status === 1 ? (
							selectedRole.resSeniority.map(seniority => {
								if (seniority.status !== 0) {
									return (
										<TableRow key={seniority.idString} className='hover:bg-gray-50'>
											<TableCell className='border border-gray-300 px-2 py-1 text-center'>
												{seniority.idString}
											</TableCell>
											<TableCell
												className={`border border-gray-300 ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-0' : 'px-2 py-1'}`}
											>
												{mode === 'edit' && selectedLevel?.id === seniority.id ? (
													<>
														<Input
															value={selectedLevel?.description || ''}
															className={`h-[40px] w-full px-2 ${selectedLevel.description.length < 3 ? 'mt-2' : ''}`}
															onChange={e => {
																setSelectedLevel(prev => ({
																	...prev,
																	description: e.target.value,
																	id: prev ? prev.id : -1,
																	idString: prev ? prev.idString : '',
																	levelName: prev ? prev.levelName : '',
																	salaryCoefficient: prev ? prev.salaryCoefficient : '-1',
																	status: prev ? prev.status : -1
																}));
															}}
														/>
														{selectedLevel?.description?.length < 3 && (
															<p className='my-1 text-sm text-red-500'>Mô tả cấp bậc không được nhỏ hơn 3 ký tự</p>
														)}
													</>
												) : (
													seniority.description
												)}
											</TableCell>
											<TableCell
												className={`border border-gray-300 ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'px-2 py-1'}`}
											>
												{mode === 'edit' && selectedLevel?.id === seniority.id ? (
													<>
														<Input
															value={selectedLevel?.levelName || ''}
															className={`h-[40px] w-full px-2 ${selectedLevel.levelName.length < 3 ? 'mt-2' : ''}`}
															onChange={e => {
																setSelectedLevel(prev => ({
																	...prev,
																	levelName: e.target.value,
																	id: prev ? prev.id : -1,
																	idString: prev ? prev.idString : '',
																	description: prev ? prev.description : '',
																	salaryCoefficient: prev ? prev.salaryCoefficient : '-1',
																	status: prev ? prev.status : -1
																}));
															}}
														/>
														{selectedLevel?.levelName?.length < 3 && (
															<p className='my-1 text-sm text-red-500'>Tên cấp bậc không được nhỏ hơn 3 ký tự</p>
														)}
													</>
												) : (
													seniority.levelName
												)}
											</TableCell>
											<TableCell
												className={`border border-gray-300 text-center ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'px-2 py-1'}`}
											>
												{mode === 'edit' && selectedLevel?.id === seniority.id ? (
													<Select
														value={selectedLevel.status.toString()}
														onValueChange={value =>
															setSelectedLevel(prev => ({
																...prev,
																status: parseInt(value),
																levelName: prev ? prev.levelName : '',
																id: prev ? prev.id : -1,
																idString: prev ? prev.idString : '',
																description: prev ? prev.description : '',
																salaryCoefficient: prev ? prev.salaryCoefficient : '-1'
															}))
														}
													>
														<SelectTrigger className='w-[148px]'>
															<SelectValue placeholder='Chọn trạng thái' />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																<SelectItem value='1'>Kích hoạt</SelectItem>
																<SelectItem value='2'>Chưa kích hoạt</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
												) : seniority.status === 1 ? (
													<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-green-500 p-1 text-white'>
														<CheckCircle className='mr-1 h-4 w-4' stroke='white' />
														Kích hoạt
													</p>
												) : (
													<p className='flex w-[100%] items-center justify-center gap-1 rounded-sm bg-yellow-500 p-1 text-white'>
														<XCircle className='mr-1 h-4 w-4' stroke='white' />
														Chưa kích hoạt
													</p>
												)}
											</TableCell>
											<TableCell
												className={`border border-gray-300 ${!selectedLevel?.salaryCoefficient ? 'w-40' : 'w20'} text-end ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'px-2 py-1'}`}
											>
												{mode === 'edit' && selectedLevel?.id === seniority.id ? (
													<>
														<Input
															value={selectedLevel?.salaryCoefficient || ''}
															className={`h-[40px] w-full px-2 ${!selectedLevel.salaryCoefficient ? 'mt-2' : ''}`}
															onChange={e => {
																const value = e.target.value;
																if (/^\d*\.?\d*$/.test(value) || value === '') {
																	setSelectedLevel(prev => ({
																		...prev,
																		salaryCoefficient: value,
																		levelName: prev ? prev.levelName : '',
																		id: prev ? prev.id : -1,
																		idString: prev ? prev.idString : '',
																		description: prev ? prev.description : '',
																		status: prev ? prev.status : -1
																	}));
																}
															}}
														/>
														{!selectedLevel?.salaryCoefficient && (
															<p className='my-1 text-start text-sm text-red-500'>Hệ số lương không được rỗng</p>
														)}
													</>
												) : (
													seniority.salaryCoefficient
												)}
											</TableCell>
											{mode === 'edit' && seniority.status === 2 && (
												<TableCell className='border border-gray-300 px-2 py-1'>
													{mode === 'edit' && selectedLevel?.id === seniority.id ? (
														<div className='flex items-center justify-center gap-1'>
															<Button
																className='h-[30px] w-[30px] bg-green-500 hover:bg-green-600'
																onClick={() => handleUpdateLevel(selectedLevel?.id, selectedLevel)}
															>
																<CheckCheck />
															</Button>
															<Button
																className='h-[30px] w-[30px] bg-red-500 hover:bg-red-600'
																onClick={() =>
																	setSelectedLevel({
																		id: -1,
																		idString: '',
																		levelName: '',
																		description: '',
																		salaryCoefficient: '-1',
																		status: -1
																	})
																}
															>
																<CircleOff />
															</Button>
														</div>
													) : (
														<>
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button variant='ghost' size='icon'>
																		<Ellipsis className='h-4 w-4' />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align='end'>
																	<DropdownMenuItem
																		onClick={() => {
																			setSelectedLevel(seniority);
																			setChangeValueLevel({
																				description: seniority.description,
																				name: seniority.levelName,
																				status: seniority.status,
																				salaryCoefficient: seniority.salaryCoefficient
																			});
																		}}
																	>
																		Sửa
																	</DropdownMenuItem>
																	<DropdownMenuItem onClick={() => setIsDialogOpen(true)}>Xóa</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
															<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
																		<AlertDialogDescription>
																			Bạn có chắc chắn muốn xóa cấp bậc{' '}
																			<strong>
																				{seniority.levelName} (ID: {seniority.id})
																			</strong>{' '}
																			này không?
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Hủy</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() => {
																				handleDeleteLevel(seniority.id);
																			}}
																		>
																			Xác nhận
																		</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>
														</>
													)}
												</TableCell>
											)}
										</TableRow>
									);
								}
							})
						) : (
							<TableRow>
								<TableCell colSpan={mode === 'edit' ? 6 : 5} className='border border-gray-300 text-start'>
									Không có cấp bậc nào
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
