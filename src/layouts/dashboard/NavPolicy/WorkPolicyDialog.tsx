import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WorkPolicyDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const WorkPolicyDialog: React.FC<WorkPolicyDialogProps> = ({ isOpen, onClose }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogOverlay />
			<DialogContent className='min-w-[50vw]'>
				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>
				<div className='mx-auto bg-white rounded-lg px-4'>
					<div className='text-center border-b pb-4 mb-4'>
						<h1 className='text-lg font-bold'>CÔNG TY INKVERSE</h1>
						<h2 className='text-lg font-bold'>CHÍNH SÁCH LÀM VIỆC</h2>
						<p className='text-sm'>Số: 99/TB-INKVERSE</p>
					</div>
					<div className='text-gray-700 space-y-4'>
						<p className='!mt-1'>Căn cứ vào quy định của công ty và Bộ luật Lao động;</p>
						<p className='!mt-1'>Giám đốc công ty INKVERSE thông báo về chính sách làm việc như sau:</p>
						<ul className='list-disc pl-6 space-y-2'>
							<li>
								<strong>Giờ làm việc</strong>: Từ 8h00 đến 17h30, từ thứ Hai đến thứ Sáu.
							</li>
							<li>
								<strong>Nghỉ trưa</strong>: 1 tiếng rưỡi từ 12h00 đến 13h30.
							</li>
						</ul>
						<div className='!mt-2'>
							<p className='mb-1'>
								Nhân viên phải có mặt tại văn phòng đúng giờ. Trong trường hợp đi trễ, sẽ áp dụng các hình thức phạt
								sau:
							</p>
							<ul className='list-disc pl-6 space-y-2'>
								<li>
									<strong>Đi trễ từ 8h30 đến 10h00</strong>: Trừ 12.5% ngày công
								</li>
								<li>
									<strong>Đi trễ từ 10h00 đến 12h00</strong>: Trừ 25% ngày công
								</li>
								<li>
									<strong>Đi trễ từ 13h30 đến 14h00</strong>: Trừ 60% ngày công
								</li>
								<li>
									<strong>Đi trễ sau 14h00</strong>: Xem như vắng
								</li>
							</ul>
							<p className='mt-1'>Nhân viên phải có mặt đúng giờ, vi phạm sẽ bị xử lý theo quy định công ty.</p>
							<p className='mt-1'>
								Nếu nhân viên đi làm nhưng quên chấm công check-in hoặc check-out, phải có minh chứng để báo về quản lý
								nhân sự, nếu không sẽ bị coi là vắng không phép.
							</p>
						</div>
					</div>
					<div className='mt-6 border-t pt-4 text-center'>
						<p className='font-bold'>GIÁM ĐỐC</p>
						<p className='italic'>(đã ký)</p>
						<p className='font-bold'>Lữ Quang Minh</p>
					</div>
				</div>
				<Button onClick={onClose}>Đóng</Button>
			</DialogContent>
		</Dialog>
	);
};

export default WorkPolicyDialog;
