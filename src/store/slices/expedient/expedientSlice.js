import { createSlice } from '@reduxjs/toolkit'

export const expedientSlice = createSlice({
	name: 'expedient',
	initialState: {
		id: null,
		data: {},
		personalInformation: {},
		aditionalInformation: {},
		patientRecord: {},
		physicalExploration: {},
		physicalActivity: {},
		smoking: {},
		feedingHabits: {},
		others: {},
		interrogation: {},
		allergies: {},
		isLoading: false,
	},
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setPersonalInformation: (state, action) => {
			state.personalInformation = action.payload
		},
		setAditionalInformation: (state, action) => {
			state.aditionalInformation = action.payload
		},
		updatePatientRecord: (state, action) => {
			state.patientRecord = action.payload
		},
		updatePhysicalExploration: (state, action) => {
			state.physicalExploration = action.payload
		},
		updatePhysicalActivity: (state, action) => {
			state.physicalActivity = action.payload
		},
		updateSmoking: (state, action) => {
			state.smoking = action.payload
		},
		updateInterrogation: (state, action) => {
			state.interrogation = action.payload
		},
		updateFeedingHabits: (state, action) => {
			state.feedingHabits = action.payload
		},
		updateOthers: (state, action) => {
			state.others = action.payload
		},
		updateAllergies: (state, action) => {
			state.allergies = action.payload
		},
		setPatientExpedient: (state, action) => {
			state.id = action.payload.id
			state.patient = action.payload.patient
			state.patientRecord = action.payload.patientRecord
			state.physicalExploration = action.payload.physicalExploration
			state.physicalActivity = action.payload.lifestyle.physicalActivity
			state.smoking = action.payload.lifestyle.smoking
			state.feedingHabits = action.payload.lifestyle.feedingHabits
			state.others = action.payload.lifestyle.others
			state.interrogation = action.payload.interrogation
			state.allergies = action.payload.allergies
		},
		setExpedient: (state, action) => {
			state.data = action.payload
		},
	},
})

export const {
	setLoading,
	setPatientExpedient,
	setPersonalInformation,
	setAditionalInformation,
	updatePatientRecord,
	updateFeedingHabits,
	updateInterrogation,
	updateOthers,
	updatePhysicalActivity,
	updatePhysicalExploration,
	updateSmoking,
	updateAllergies,
	setExpedient,
} = expedientSlice.actions
