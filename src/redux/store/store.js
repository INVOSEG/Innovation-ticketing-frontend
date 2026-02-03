import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import rootReducer from "../reducer"; // Root reducer

// Redux Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "dashboard"], // Only persist specific slices
  blacklist: ["loading", "ticket"], // Use this if you want to blacklist slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [],
  devTools: process.env.NODE_ENV !== "development", // Enable DevTools in development
});

// Persistor for persisting store
export const persistor = persistStore(store);

export default store;
