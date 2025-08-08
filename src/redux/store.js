import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import ticketReducer from "./feature/ticketSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 1. Create a persistent configuration
// This config tells redux-persist how to persist the Redux state.
const persistConfig = {
    key: 'root',                 //the key for the persisted data in storage (here, 'root')
    storage,                     //the storage engine to use (localStorage for web) 
    version: 1,                  //version of the persisted state (for migrations)
    whitelist: ['auth'],         //which slices of state to persist (here, only 'auth')
    blacklist: []                //which slices of state to not persist (here, none)
}

// 2. Combine reducers
const rootReducer = combineReducers({// If you have multiple slices, combine them here. For now, only 'auth'.
    auth: authReducer,
    ticket: ticketReducer,
})

// 3. Wrap rootReducer with persistReducer

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({  
            serializableCheck: false,
        }),
})


// 5. Persist the store
export const persistor = persistStore(store);

