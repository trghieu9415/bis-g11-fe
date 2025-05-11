import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import usersReducer from './slices/usersSlice';
import userDetailReducer from './slices/userDetailSlice';
import leaveRequestByUserIDReducer from './slices/leaveRequestByUserIDSlice';
import contractsByUserIDReducer from './slices/contractsByUserIDSlice';
import attendanceDetailsByUserIDReducer from './slices/attendanceDetailByUserIDSlice';
import contractsReducer from './slices/contractsSlice';
import leaveRequestsReducer from './slices/leaveRequestsSlice';
import timeTrackingTodayReducer from './slices/timeTrackingTodaySlice';
import holidaysReducer from './slices/holidaysSlice';
import timeTrackingMonthReducer from './slices/timeTrackingMonthSlice';
import scanAttendanceDetailReducer from './slices/scanAttendanceDetailSlice';
import payrollsByYearMonthReducer from './slices/payrollsByYearMonthSlice';
import payrollsYearByUserIDReducer from './slices/payrollsYearByUserIDSlice';
import allowancesReducer from './slices/allowancesSlice';
import payrollsByYearReducer from './slices/payrollsByYearSlice';
import rolesReducer from './slices/rolesSlice';
import payrollYearByUserReducer from './slices/payrollByYearAndUserIdSlice';
import postToggleSidebarReducer from './slices/toggleSideBarSlice';
import productsReducer from './slices/productSlice';
import supplierReducer from './slices/supplierSlice';
import authorReducer from './slices/authorSlice';
import categoryReducer from './slices/categorySlice';
import goodsReceiptReducer from './slices/goodReceiptsSlice';
import salaryMonthStatisticsReducer from './slices/salaryMonthStatisticsSlice';
import employeeMonthStatisticsReducer from './slices/employeeMonthStatisticsSlice';
import authReducer, { authStorageListener, authLogoutListener } from './slices/authSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
	reducer: {
		users: usersReducer,
		roles: rolesReducer,
		user: userDetailReducer,
		leaveRequestByUserID: leaveRequestByUserIDReducer,
		contractsByUserID: contractsByUserIDReducer,
		attendanceDetailsByUserID: attendanceDetailsByUserIDReducer,
		contracts: contractsReducer,
		leaveRequests: leaveRequestsReducer,
		timeTrackingToday: timeTrackingTodayReducer,
		holidays: holidaysReducer,
		timeTrackingMonth: timeTrackingMonthReducer,
		scanAttendanceDetail: scanAttendanceDetailReducer,
		payrollsByYearMonth: payrollsByYearMonthReducer,
		payrollsYearByUserID: payrollsYearByUserIDReducer,
		allowances: allowancesReducer,
		payrollsByYear: payrollsByYearReducer,
		payrollYearByUser: payrollYearByUserReducer,
		isHideSidebar: postToggleSidebarReducer,
		products: productsReducer,
		supplier: supplierReducer,
		author: authorReducer,
		category: categoryReducer,
		goodsReceipt: goodsReceiptReducer,
		auth: authReducer,
		salaryMonthStatistics: salaryMonthStatisticsReducer,
		employeeMonthStatistics: employeeMonthStatisticsReducer,
		profile: profileReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().prepend(authStorageListener.middleware).prepend(authLogoutListener.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
