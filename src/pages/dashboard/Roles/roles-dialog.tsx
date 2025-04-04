import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import LevelsTable from '@/pages/dashboard/Levels/levels-table';
import { updateRole } from '@/services/roleService';

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
	mode: string;
	onClose: () => void;
};

export default function RolesDialog({ isOpen, selectedRole, onClose, mode }: RolesDialogProps) {
	const handleUpdateRole = async (role: Role) => {
		
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={() => onClose()}>
				<DialogContent className='min-w-[1000px] max-h-[98vh] ' onOpenAutoFocus={e => e.preventDefault()}>
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
									disabled
								/>
							</div>
							<div>
								<label htmlFor='role-name' className='w-full text-sm mb-1 text-start font-semibold'>
									Tên chức vụ
								</label>
								<Input
									id='role-name'
									type='text'
									value={selectedRole ? selectedRole.name : 'N/A'}
									className='w-full'
									disabled={mode !== 'edit'}
								/>
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
								disabled={mode !== 'edit'}
							/>
						</div>
					</div>
					{mode === 'edit' && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='px-4 py-2 border w-[80px] ml-auto float-end bg-black text-white rounded-md hover:bg-gray-600 transition '>
									Lưu
								</button>
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
					)}
					<LevelsTable selectedRole={selectedRole} mode={mode} />
					<div className='flex justify-end gap-2'>
						<button
							className='px-4 py-2 border bg-white text-black rounded-md hover:bg-gray-100 transition'
							onClick={() => onClose()}
						>
							Thoát
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
