import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LeavePolicyDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const LeavePolicyDialog: React.FC<LeavePolicyDialogProps> = ({ isOpen, onClose }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogOverlay />
			<DialogContent className='min-w-[50vw] '>
				{/* <DialogTitle>Chính sách nghỉ phép</DialogTitle> */}
				<DialogDescription>{/* Add your content here */}</DialogDescription>
				<div className='mx-auto bg-white rounded-lg p-6'>
					{/* Increased max-width */}
					<div className='text-center border-b pb-4 mb-4'>
						<h1 className='text-lg font-bold'>CÔNG TY INKVERSE</h1>
						<h2 className='text-lg font-bold'>CHÍNH SÁCH NGHỈ PHÉP</h2>
						<p className='text-sm'>Số: 98/TB-INKVERSE</p>
					</div>
					{/* <div className='text-center border-b pb-4 mb-4'>
						<h1 className='text-xl font-bold uppercase'>THÔNG BÁO</h1>
						<p className='text-lg italic'>Về việc nghỉ Lễ Quốc Khánh 02/9/2022</p>
					</div> */}
					<div className='text-gray-700 space-y-4'>
						<p>Căn cứ Bộ luật Lao động nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam;</p>
						<p className='!mt-1'>Căn cứ vào chính sách phát triển nguồn nhân lực của Công ty INKVERSE;</p>
						<p className='!mt-1'>Giám đốc công ty INKVERSE thông báo về chính sách nghỉ phép như sau:</p>
						<ul className='list-disc pl-6 space-y-2'>
							<li>
								<strong>Nghỉ phép</strong>: 12 ngày / 1 năm.
							</li>
							<li>
								<strong>Nghỉ thai sản</strong>: 6 tháng đối với nữ, 7 ngày đối với nam.
							</li>
							<li>
								<strong>Nghỉ bệnh</strong>: 7 ngày.
							</li>
							<li>
								<strong>Chế độ chi trả</strong>:
								<ul className='list-disc pl-6 mb-1'>
									<li>Nghỉ phép năm do công ty chi trả.</li>
									<li>BHXH chi trả cho nghỉ thai sản và nghỉ bệnh.</li>
								</ul>
								Nghỉ không phép sẽ bị trừ lương theo quy định công ty.
								<br />
								Nhân viên nghỉ phép phải báo trước ít nhất 1 ngày. Ngày lễ, Tết áp dụng theo quy định công ty.
							</li>
						</ul>
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

export default LeavePolicyDialog;
