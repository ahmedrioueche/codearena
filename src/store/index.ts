import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { settingsSlice } from "./slices/settings";

const rootReducer = combineReducers({
  theme: settingsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "prod",
});

const bindActions = <T extends Record<string, (...args: any[]) => any>>(
  actions: T
) =>
  Object.keys(actions).reduce((acc, key) => {
    acc[key as keyof T] = (...args: Parameters<T[keyof T]>) =>
      store.dispatch(actions[key as keyof T](...args));
    return acc;
  }, {} as { [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> });

export const settingsActions = bindActions(settingsSlice.actions);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
