import { Moon, BriefcaseBusiness, Map, Clock3 } from 'lucide-react';
import { useState } from 'react';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar';
import LeavePolicyDialog from './NavPolicy/LeavePolicyDialog';
import WorkPolicyDialog from './NavPolicy/WorkPolicyDialog';
import SalaryStructureDialog from './NavPolicy/SalaryStructureDialog';

export function NavPolicies() {
	const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
	const [isWorkDialogOpen, setIsWorkDialogOpen] = useState(false);
	const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);

	const policies = [
		{
			name: 'Cơ cấu lương',
			url: '#',
			icon: Map,
			onClick: () => setIsSalaryDialogOpen(true)
		},
		{
			name: 'Chính sách làm việc',
			url: '#',
			icon: BriefcaseBusiness,
			onClick: () => setIsWorkDialogOpen(true)
		},
		{
			name: 'Chính sách nghỉ phép',
			url: '#',
			icon: Clock3,
			onClick: () => setIsLeaveDialogOpen(true)
		}
	];

	return (
		<>
			<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
				<SidebarGroupLabel>Chính sách công ty</SidebarGroupLabel>
				<SidebarMenu>
					{policies.map(item => (
						<SidebarMenuItem key={item.name}>
							<SidebarMenuButton asChild>
								<a href={item.url} onClick={item.onClick}>
									{item.icon && <item.icon />}
									<span>{item.name}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
			<LeavePolicyDialog isOpen={isLeaveDialogOpen} onClose={() => setIsLeaveDialogOpen(false)} />
			<WorkPolicyDialog isOpen={isWorkDialogOpen} onClose={() => setIsWorkDialogOpen(false)} />
			<SalaryStructureDialog isOpen={isSalaryDialogOpen} onClose={() => setIsSalaryDialogOpen(false)} />
		</>
	);
}
