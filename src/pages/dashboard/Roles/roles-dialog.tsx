import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
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

type RolesDialogProps = {
	isOpen: boolean;
	selectedRole: Role | null;
	onClose: () => void;
};

export default function RolesDialog({ isOpen, selectedRole, onClose }: RolesDialogProps) {
	const [isShowAdd, setIsShowAdd] = useState(false);
	const [isUpdateLevel, setIsUPdateLevel] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='min-w-[1000px] max-h-[98vh] '>
				<DialogHeader>
					<DialogTitle>{selectedRole ? selectedRole.name : 'Role Details'}</DialogTitle>
					<DialogDescription>{selectedRole ? selectedRole.description : 'No role selected'}</DialogDescription>
				</DialogHeader>
				<div className='grid grid-cols-2 gap-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label htmlFor='role-id' className='w-full text-sm mb-1 text-start font-semibold'>
								ID
							</label>
							<Input
								id='role-id'
								type='text'
								value={selectedRole ? selectedRole.id : 'N/A'}
								className='w-full'
								readOnly
								disabled
							/>
						</div>
						<div>
							<label htmlFor='role-name' className='w-full text-sm mb-1 text-start font-semibold'>
								Tên cấp bậc
							</label>
							<Input id='role-name' type='text' value={selectedRole ? selectedRole.name : 'N/A'} className='w-full' />
						</div>
					</div>
					<div>
						<label htmlFor='role-description' className='w-full text-sm mb-1 text-start font-semibold'>
							Mô tả
						</label>
						<Input
							id='role-description'
							type='text'
							value={selectedRole ? selectedRole.description : 'N/A'}
							className='w-full'
						/>
					</div>
				</div>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<div>
							<button className='px-4 py-2 border bg-black text-white rounded-md hover:bg-gray-600 transition float-end'>
								Lưu
							</button>
						</div>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Xác nhận lưu</AlertDialogTitle>
							<AlertDialogDescription>Bạn có chắc chắn muốn lưu những thay đổi này không?</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Thoát</AlertDialogCancel>
							<AlertDialogAction>Xác nhận</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<div className='mt-2'>
					<div className='flex justify-between items-center'>
						<h3 className='text-base font-semibold'>Danh sách cấp bậc</h3>
						{!isShowAdd ? (
							<ChevronDown className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
						) : (
							<ChevronUp className='hover:cursor-pointer' onClick={() => setIsShowAdd(!isShowAdd)} />
						)}
					</div>
					{isShowAdd && (
						<>
							<div className='grid grid-cols-2 gap-4 mt-1'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label htmlFor='level-id' className='w-full text-sm mb-1 text-start font-semibold'>
											Tên cấp bậc
										</label>
										<Input id='level-id' type='text' className='w-full' />
									</div>
									<div>
										<label htmlFor='level-name' className='w-full text-sm mb-1 text-start font-semibold'>
											Hệ số lương
										</label>
										<Input id='level-name' type='text' className='w-full' />
									</div>
								</div>
								<div>
									<label htmlFor='level-description' className='w-full text-sm mb-1 text-start font-semibold'>
										Mô tả
									</label>
									<Input id='level-description' type='text' className='w-full' />
								</div>
							</div>
							<div className='h-[40px] mb-2'>
								<Button className='bg-green-800 hover:bg-green-900  mt-2 float-end'>
									<Plus />
									Thêm
								</Button>
							</div>
						</>
					)}
					<div className={`overflow-y-auto ${isShowAdd ? 'max-h-[300px]' : 'max-h-[400px]'}  pr-1`}>
						<Table className='min-w-full border border-gray-300 mt-2'>
							<TableHeader className='bg-gray-100'>
								<TableRow>
									<TableCell className='border border-gray-300 py-1 px-2'>ID</TableCell>
									<TableCell className='border border-gray-300 py-1 px-2'>Mô tả</TableCell>
									<TableCell className='border border-gray-300 py-1 px-2'>Tên cấp bậc</TableCell>
									<TableCell className='border border-gray-300 py-1 px-2 w-16 text-center'>Hệ số lương</TableCell>
									<TableCell className='border border-gray-300 py-1 px-2 w-16 text-center'>Thao tác</TableCell>
								</TableRow>
							</TableHeader>
							<TableBody>
								{selectedRole?.resSeniority && selectedRole.resSeniority.length > 0 ? (
									selectedRole.resSeniority.map(seniority => (
										<TableRow key={seniority.id} className='hover:bg-gray-50'>
											<TableCell className='border border-gray-300 py-1 px-2 text-center'>{seniority.id}</TableCell>
											<TableCell className='border border-gray-300 py-1 px-2'>{seniority.description}</TableCell>
											<TableCell className='border border-gray-300 py-1 px-2 '>{seniority.levelName}</TableCell>
											<TableCell className='border border-gray-300 py-1 px-2 text-end'>
												{seniority.salaryCoefficient}
											</TableCell>
											<TableCell className='border border-gray-300 py-1 px-2'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<Ellipsis className='w-4 h-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem onClick={() => setIsUPdateLevel(true)}>Sửa</DropdownMenuItem>
														<DropdownMenuItem>Xóa</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={5} className='border border-gray-300 text-start'>
											Không có cấp bậc nào
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
				<div className='flex justify-end gap-2'>
					<button
						className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
						onClick={onClose}
					>
						Thoát
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
