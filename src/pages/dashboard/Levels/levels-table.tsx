import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ChevronDown, ChevronUp, Ellipsis, CheckCheck, CircleOff, CheckCircle, XCircle } from 'lucide-react';
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { updateLevel, deleteLevel, addLevel } from '@/services/levelService';

interface ResSeniority {
	id: number;
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
	resSeniority: ResSeniority[];
};

type Level = {
	id: number;
	levelName: string;
	description: string;
	roleId: number;
	salaryCoefficient: string | number;
	status: number;
};

interface NewLevel {
	levelName: string;
	description: string;
	salaryCoefficient: number;
	roleId: number;
}

type RolesDialogProps = {
	selectedRole: Role | null;
	mode: string;
};

export default function LevelsTable({ selectedRole, mode }: RolesDialogProps) {
	const [isShowAdd, setIsShowAdd] = useState(false);
	const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
			salaryCoefficient: 0.0,
			roleId: -1
		}
	});

	const formData = watch();

	const handleAddLevel = async (level: NewLevel) => {
		try {
			const fieldsToValidate = ['levelName', 'description', 'salaryCoefficient', 'roleId'] as const;
			const isValid = await trigger(fieldsToValidate);
			if (isValid) {
				const levelData = {
					levelName: level?.levelName,
					description: level?.description,
					salaryCoefficient:
						typeof level?.salaryCoefficient === 'string'
							? parseFloat(level.salaryCoefficient)
							: (level?.salaryCoefficient ?? 0),
					roleId: level?.roleId
				};
				console.log(levelData);
				const res = await addLevel(levelData);
				console.log(res);
				// @ts-expect-error - exception success attr
				if (res.success) {
					toast.success('Thêm thông tin cấp bậc thành công!');
					reset();
				}
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

	const handleUpdateLevel = async (levelID: number, level: Level) => {
		try {
			const levelData = {
				levelName: level?.levelName,
				description: level?.description,
				salaryCoefficient:
					typeof level?.salaryCoefficient === 'string'
						? parseFloat(level.salaryCoefficient)
						: (level?.salaryCoefficient ?? 0),
				roleId: level?.roleId
			};
			console.log(levelID, levelData);
			const res = await updateLevel(levelID, levelData);
			console.log(res);
			// @ts-expect-error - exception success attr
			if (res.success) {
				toast.success('Cập nhật thông tin cấp bậc thành công!');
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
			console.log(res);
			// @ts-expect-error - exception success attr
			if (res.success) {
				toast.success('Xóa cấp bậc thành công!');
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
				<div className='flex justify-between items-center'>
					<h3 className='text-base font-semibold'>Danh sách cấp bậc</h3>
					{mode === 'edit' && !isShowAdd ? (
						<ChevronDown className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
					) : (
						mode === 'edit' && <ChevronUp className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
					)}
				</div>
				{mode === 'edit' && isShowAdd && (
					<>
						<div className='grid grid-cols-2 gap-4 mt-1'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label htmlFor='level-id' className='w-full text-sm mb-1 text-start font-semibold'>
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
									{errors.levelName && <p className='text-red-500 text-sm'>{errors.levelName.message}</p>}
								</div>
								<div>
									<label htmlFor='level-salary-coefficient' className='w-full text-sm mb-1 text-start font-semibold'>
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
										<p className='text-red-500 text-sm'>{errors.salaryCoefficient.message}</p>
									)}
								</div>
							</div>
							<div>
								<label htmlFor='level-description' className='w-full text-sm mb-1 text-start font-semibold'>
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
								{errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
							</div>
						</div>
						<div className='h-[40px] mb-2'>
							<Button
								className='bg-green-800 hover:bg-green-900  mt-2 float-end'
								onClick={() => handleAddLevel(formData)}
							>
								<Plus />
								Thêm
							</Button>
						</div>
					</>
				)}
			</div>
			<div className={`overflow-y-auto ${isShowAdd ? 'max-h-[300px]' : 'max-h-[400px]'}  pr-1`}>
				<Table className='min-w-full border border-gray-300 mt-2'>
					<TableHeader className='bg-gray-100'>
						<TableRow>
							<TableCell className='border border-gray-300 py-1 px-2'>ID</TableCell>
							<TableCell className='border border-gray-300 py-1 px-2 '>Mô tả</TableCell>
							<TableCell className='border border-gray-300 py-1 px-2'>Tên cấp bậc</TableCell>
							<TableCell className='border border-gray-300 py-1 px-2 w-22 text-center'>Trạng thái</TableCell>
							<TableCell className='border border-gray-300 py-1 px-2 w-16 text-center'>Hệ số lương</TableCell>
							{mode === 'edit' && (
								<TableCell className='border border-gray-300 py-1 px-2 w-22 text-center'>Thao tác</TableCell>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{selectedRole?.resSeniority && selectedRole.resSeniority.length > 0 ? (
							selectedRole.resSeniority.map(seniority => (
								<TableRow key={seniority.id} className='hover:bg-gray-50'>
									<TableCell className='border border-gray-300 py-1 px-2 text-center'>{seniority.id}</TableCell>
									<TableCell
										className={`border border-gray-300 ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-0' : 'py-1  px-2 '}`}
									>
										{mode === 'edit' && selectedLevel?.id === seniority.id ? (
											<Input
												value={selectedLevel?.description || ''}
												className='w-full h-[40px] px-2'
												onChange={e => {
													setSelectedLevel(prev => ({
														...prev,
														description: e.target.value,
														id: prev ? prev.id : -1,
														levelName: prev ? prev.levelName : '',
														roleId: prev ? prev.roleId : -1,
														salaryCoefficient: prev ? prev.salaryCoefficient : '-1',
														status: prev ? prev.status : -1
													}));
												}}
											/>
										) : (
											seniority.description
										)}
									</TableCell>
									<TableCell
										className={`border border-gray-300 ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'py-1  px-2 '}`}
									>
										{mode === 'edit' && selectedLevel?.id === seniority.id ? (
											<Input
												value={selectedLevel?.levelName || ''}
												className='w-full h-[40px] px-2'
												onChange={e => {
													setSelectedLevel(prev => ({
														...prev,
														levelName: e.target.value,
														id: prev ? prev.id : -1,
														description: prev ? prev.description : '',
														roleId: prev ? prev.roleId : -1,
														salaryCoefficient: prev ? prev.salaryCoefficient : '-1',
														status: prev ? prev.status : -1
													}));
												}}
											/>
										) : (
											seniority.levelName
										)}
									</TableCell>
									<TableCell
										className={`border border-gray-300 text-center ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'py-1  px-2 '}`}
									>
										{mode === 'edit' && selectedLevel?.id === seniority.id ? (
											<Select
												value={selectedLevel.status.toString()}
												onValueChange={value =>
													setSelectedLevel(prev => ({
														...prev,
														status: parseInt(value),
														id: prev ? prev.id : -1,
														levelName: prev ? prev.levelName : '',
														roleId: prev ? prev.roleId : -1,
														salaryCoefficient: prev ? prev.salaryCoefficient : '-1',
														description: prev ? prev.description : ''
													}))
												}
											>
												<SelectTrigger className='w-[180px]'>
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
											<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-green-500 rounded-sm p-1'>
												<CheckCircle className='w-4 h-4 mr-1' stroke='white' />
												Kích hoạt
											</p>
										) : (
											<p className='text-white flex items-center gap-1 justify-center w-[100%] bg-red-500 rounded-sm p-1'>
												<XCircle className='w-4 h-4 mr-1' stroke='white' />
												Chưa kích hoạt
											</p>
										)}
									</TableCell>
									<TableCell
										className={`border border-gray-300 w-20 text-end ${mode === 'edit' && selectedLevel?.id === seniority.id ? 'py-1' : 'py-1  px-2 '}`}
									>
										{mode === 'edit' && selectedLevel?.id === seniority.id ? (
											<Input
												value={selectedLevel?.salaryCoefficient || ''}
												placeholder='Điền hệ số lương...'
												className='w-full h-[40px] px-2'
												onChange={e => {
													const value = e.target.value;
													if (/^\d*\.?\d*$/.test(value) || value === '') {
														setSelectedLevel(prev => ({
															...prev,
															salaryCoefficient: value,
															id: prev?.id ?? -1,
															description: prev?.description ?? '',
															roleId: prev?.roleId ?? -1,
															levelName: prev?.levelName ?? '',
															status: prev?.status ?? -1
														}));
													}
												}}
											/>
										) : (
											seniority.salaryCoefficient
										)}
									</TableCell>
									{mode === 'edit' && seniority.status === 2 && (
										<TableCell className='border border-gray-300 py-1 px-2'>
											{mode === 'edit' && selectedLevel?.id === seniority.id ? (
												<div className='flex justify-center items-center gap-1'>
													<Button
														className='bg-green-500 hover:bg-green-600 h-[30px] w-[30px]'
														onClick={() => handleUpdateLevel(selectedLevel?.id, selectedLevel)}
													>
														<CheckCheck />
													</Button>
													<Button
														className='bg-red-500 hover:bg-red-600  h-[30px] w-[30px]'
														onClick={() =>
															setSelectedLevel({
																id: -1,
																levelName: '',
																description: '',
																roleId: -1,
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
																<Ellipsis className='w-4 h-4' />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuItem onClick={() => setSelectedLevel(seniority)}>Sửa</DropdownMenuItem>
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
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className='border border-gray-300 text-start'>
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
