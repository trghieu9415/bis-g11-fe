import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';

export const store = configureStore({
	reducer: {
		users: usersReducer,
		roles: rolesReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
