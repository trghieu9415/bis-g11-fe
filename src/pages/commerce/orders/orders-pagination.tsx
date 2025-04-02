import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';

interface OrdersPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const OrdersPagination = ({ currentPage, totalPages, onPageChange }: OrdersPaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<div className='p-4 border-t'>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious onClick={() => onPageChange(Math.max(currentPage - 1, 1))} isActive={currentPage > 1} />
					</PaginationItem>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
						<PaginationItem key={page}>
							<PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
							isActive={currentPage < totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};
