import { useEffect, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import config from '@/config';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

const routes = config.routes;

export function DashboardBreadcrumb() {
	const location = useLocation();
	const [nav, setNav] = useState([{ title: 'Trang chủ', link: '/' }]);

	useEffect(() => {
		for (const [key, pattern] of Object.entries(routes)) {
			if (matchPath({ path: pattern, end: true }, location.pathname)) {
				switch (key) {
					case 'userInformation':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Thông tin nhân viên', link: '/user' }
						]);
						break;

					case 'hremployee':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách nhân sự', link: routes.hremployee }
						]);
						break;

					case 'contracts':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách hợp đồng', link: routes.contracts }
						]);
						break;

					case 'leaveRequests':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Đơn nghỉ phép', link: routes.leaveRequests }
						]);
						break;

					case 'leaveRequestsByType':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Đơn nghỉ phép', link: routes.leaveRequests }
						]);
						break;

					case 'timeTrackingToday':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Chấm công hôm nay', link: routes.timeTrackingToday }
						]);
						break;

					case 'timeTrackingMonth':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Chấm công tháng', link: routes.timeTrackingMonth }
						]);
						break;

					case 'holiday':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Ngày nghỉ', link: routes.holiday }
						]);
						break;

					case 'salaryMonth':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Bảng lương', link: '' },
							{ title: 'Theo tháng', link: routes.salaryMonth }
						]);
						break;

					case 'salaryYear':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Bảng lương', link: '' },
							{ title: 'Theo năm', link: routes.salaryYear }
						]);
						break;

					case 'roles':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Phân quyền', link: routes.roles }
						]);
						break;

					// For sales
					case 'newOrder':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Đơn hàng mới', link: routes.newOrder }
						]);
						break;
					case 'orders':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách đơn hàng', link: routes.orders }
						]);
						break;
					case 'customers':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách khách hàng', link: routes.customers }
						]);
						break;

					// For warehouse
					case 'products':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách sản phẩm', link: routes.products }
						]);
						break;
					case 'author':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách tác giả', link: routes.author }
						]);
						break;
					case 'category':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Danh sách danh mục', link: routes.category }
						]);
						break;
					case 'inventory':
						setNav([
							{ title: 'Trang chủ', link: '/' },
							{ title: 'Nhập sách', link: routes.inventory }
						]);
						break;

					default:
						setNav([{ title: 'Trang chủ', link: '/' }]);
						break;
				}

				break;
			}
		}
	}, [location.pathname]);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{nav.map((item, idx) => {
					if (idx === nav.length - 1) {
						return (
							<BreadcrumbItem key={idx}>
								<BreadcrumbPage>{item.title}</BreadcrumbPage>
							</BreadcrumbItem>
						);
					} else {
						return (
							<div className='flex items-center justify-center gap-2' key={idx}>
								<BreadcrumbItem>
									{item.link ? (
										<BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{item.title}</BreadcrumbPage>
									)}
								</BreadcrumbItem>
								<BreadcrumbSeparator />
							</div>
						);
					}
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
