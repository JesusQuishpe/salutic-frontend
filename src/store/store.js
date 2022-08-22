import { configureStore } from '@reduxjs/toolkit'
import { expedientSlice } from './slices/expedient/expedientSlice'
import { odontologySlice } from './slices/odontology/odontologySlice'

export const store = configureStore({
	reducer: {
		expedient: expedientSlice.reducer,
		odontology: odontologySlice.reducer,
	},
})
