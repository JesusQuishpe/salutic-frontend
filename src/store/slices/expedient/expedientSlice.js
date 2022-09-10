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
		notFound: false,
	},
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setNotFound: (state, action) => {
			state.notFound = action.payload
		},
		resetExpedientData: (state, action) => {
			state.data = {}
			state.id = null
			state.patient = {}
			state.patientRecord = {}
			state.physicalExploration = {}
			state.physicalActivity = {}
			state.smoking = {}
			state.feedingHabits = {}
			state.others = {}
			state.interrogation = {}
			state.allergies = {}
			state.notFound = false
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
		setExpedient: (state, action) => {
			state.data = action.payload
			state.id = action.payload.id
			state.patient = action.payload.patient
			state.patientRecord = action.payload.patientRecord
			state.physicalExploration = action.payload.physicalExploration
			state.physicalActivity = action.payload.physicalActivity
			state.smoking = action.payload.smoking
			state.feedingHabits = action.payload.feedingHabits
			state.others = action.payload.others
			state.interrogation = action.payload.interrogation
			state.allergies = action.payload.allergies
		},
	},
})

export const {
	setLoading,
	initExpedientState,
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
	setNotFound,
	resetExpedientData,
} = expedientSlice.actions
