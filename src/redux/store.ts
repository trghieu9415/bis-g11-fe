import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
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
		isHideSidebar: postToggleSidebarReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
