import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import userDetailReducer from './slices/userDetailSlice';
import leaveRequestByUserIDReducer from './slices/leaveRequestByUserIDSlice';
import contractsByUserIDReducer from './slices/contractsByUserIDSlice';
import attendanceDetailsByUserIDReducer from './slices/attendanceDetailByUserIDSlice';
import contractsReducer from './slices/contractsSlice';
import leaveRequestsReducer from './slices/leaveRequestsSlice';
import timeTrackingTodayReducer from './slices/timeTrackingTodaySlice';

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
		timeTrackingToday: timeTrackingTodayReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
