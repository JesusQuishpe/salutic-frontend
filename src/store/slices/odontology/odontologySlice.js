import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { createDataToIndicators } from '../../../components/odontologia/nueva-consulta/OdoIndicatorsTab'
import { generateUniqueId } from '../../../utils/functions'

const hasSomeItem = (tooth) => {
	//Si está en blanco quiere decir que no hay ningun lado pintado
	if (
		tooth.topSide !== '' ||
		tooth.rightSide !== '' ||
		tooth.leftSide !== '' ||
		tooth.bottomSide !== '' ||
		tooth.centerSide !== '' ||
		tooth.symboPath !== ''
	) {
		return true
	}
	return false
}

const initialValues = {
	generalInfo: {
		date: moment().format('YYYY-MM-DD'),
		ageRange: null,
		reasonConsultation: '',
		currentDiseaseAndProblems: '',
		procedure: null,
		value: 0,
	},
	familyHistory: {
		familyHistoryDescription: '',
		selectedFamilyHistory: [],
		pathologiesDescription: '',
		selectedPathologies: [],
	},
	indicator: {
		perDisease: null,
		badOcclu: null,
		fluorosis: null,
		plaqueTotal: 0,
		calcTotal: 0,
		ginTotal: 0,
		indicators: [],
	},
	cpoCeoRatios: {
		cpoC: null,
		cpoP: null,
		cpoO: null,
		cpoTotal: null,
		ceoC: null,
		ceoE: null,
		ceoO: null,
		ceoTotal: null,
	},
	planAndDiagnostics: {
		planDescription: '',
		selectedPlans: [],
		diagnostics: [],
	},
	treatments: [],
	odontogram: {
		odontogramId: null,
		movilitiesRecessions: [],
		teeth: [],
	},
	acta: null,
}

export const odontologySlice = createSlice({
	name: 'odontology',
	initialState: {
		isEdit: false,
		data: null,
		generalInfo: initialValues.generalInfo,
		familyHistory: initialValues.familyHistory,
		indicator: initialValues.indicator,
		cpoCeoRatios: initialValues.cpoCeoRatios,
		planAndDiagnostics: initialValues.planAndDiagnostics,
		treatments: initialValues.treatments,
		movilitiesRecessions: initialValues.odontogram.movilitiesRecessions,
		teeth: initialValues.odontogram.teeth,
		optionSelected: {},
		acta: null,
		isLoading: false,
		isClickOutSidePalette: false,
	},
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setDataForNewConsultation: (state, action) => {
			console.log(action)
			const data = action.payload
			state.data = data
			state.movilitiesRecessions = data?.odontogram?.movilitiesRecessions
			state.teeth = data?.odontogram?.teeth.map((detail) => ({
				topSide: detail.topSide,
				rightSide: detail.rightSide,
				bottomSide: detail.bottomSide,
				leftSide: detail.leftSide,
				centerSide: detail.centerSide,
				symboPath: detail.symbologie?.path,
				symboId: detail.symboId,
				toothId: detail.toothId,
				id: detail.id,
			}))
		},
		setDataForEdit: (state, action) => {
			const data = action.payload
			state.data = data
			state.generalInfo = {
				id: data?.patientRecord?.id,
				date: data?.patientRecord?.date,
				ageRange: data?.patientRecord?.ageRange,
				reasonConsultation: data?.patientRecord?.reasonConsultation,
				currentDiseaseAndProblems:
					data?.patientRecord?.currentDiseaseAndProblems,
				procedure: null,
				value: data?.patientRecord?.value,
			}
			state.familyHistory = {
				id: data?.familyHistory?.id,
				stoTestId: data?.stomatognathicTest?.id,
				familyHistoryDescription: data?.familyHistory?.description,
				pathologiesDescription: data?.stomatognathicTest.description,
				selectedFamilyHistory: data?.familyHistory?.details.map(
					(detail) => detail.diseaseId
				),
				selectedPathologies: data?.stomatognathicTest?.details.map(
					(detail) => detail.patId
				),
			}
			state.indicator = {
				id: data?.indicator?.id,
				perDisease: data?.indicator?.perDisease,
				badOcclu: data?.indicator?.badOcclu,
				fluorosis: data?.indicator?.fluorosis,
				calcTotal: data?.indicator?.calcTotal,
				plaqueTotal: data?.indicator?.plaqueTotal,
				ginTotal: data?.indicator?.ginTotal,
				indicators: data?.indicator?.details.map((detail) => ({
					id: detail.id,
					rowPos: detail.rowPos,
					plaque: detail.plaque,
					calc: detail.calc,
					gin: detail.gin,
					selectedPieces: detail.selectedPieces.split(','),
				})),
			}
			state.cpoCeoRatios = {
				id: data?.cpoCeoRatios.id,
				cpoC: data?.cpoCeoRatios.cd,
				cpoP: data?.cpoCeoRatios.pd,
				cpoO: data?.cpoCeoRatios.od,
				cpoTotal: data?.cpoCeoRatios.cpoTotal,
				ceoC: data?.cpoCeoRatios.ce,
				ceoE: data?.cpoCeoRatios.ee,
				ceoO: data?.cpoCeoRatios.oe,
				ceoTotal: data?.cpoCeoRatios.ceoTotal,
			}
			state.planAndDiagnostics = {
				id: data?.planDiagnostic.id,
				planDescription: data?.planDiagnostic.description,
				selectedPlans: data?.planDiagnostic.details.map(
					(detail) => detail.planId
				),
				diagnostics: data?.diagnostics.map((diag, index) => ({
					rowId: index,
					description: diag.description,
					cie: diag.cie.disease,
					type: diag.type,
					cieId: diag.cie.id,
				})),
			}
			state.treatments = data?.treatments.map((treat) => ({
				sesion: treat.sesion,
				complications: treat.complications,
				procedures: treat.procedures,
				prescriptions: treat.prescriptions,
				rowId: generateUniqueId(),
			}))
			state.movilitiesRecessions = data?.odontogram?.movilitiesRecessions
			state.teeth = data?.odontogram?.teeth.map((detail) => ({
				topSide: detail.topSide,
				rightSide: detail.rightSide,
				bottomSide: detail.bottomSide,
				leftSide: detail.leftSide,
				centerSide: detail.centerSide,
				symboPath: detail.symbologie?.path,
				symboId: detail.symboId,
				toothId: detail.toothId,
				id: detail.id,
			}))
		},
		setFamilyHistory: (state, action) => {
			state.familyHistory = action.payload
		},
		setGeneralInfo: (state, action) => {
			state.generalInfo = action.payload
		},
		setIndicator: (state, action) => {
			state.indicator = action.payload
		},
		setCpoCeoRatios: (state, action) => {
			state.cpoCeoRatios = action.payload
		},
		setPlanAndDiagnostics: (state, action) => {
			state.planAndDiagnostics = action.payload
		},
		setTreatments: (state, action) => {
			state.treatments = action.payload
		},
		setMovilitiesRecessions: (state, action) => {
			const mrInput = action.payload
			const newMovilitiesRecessions = [...state.movilitiesRecessions]
			const index = state.movilitiesRecessions.findIndex(
				(mr) => mr.pos === mrInput.pos
			)
			if (index >= 0) {
				newMovilitiesRecessions.splice(index, 1, mrInput)
			} else {
				newMovilitiesRecessions.push(mrInput)
			}
			state.movilitiesRecessions = newMovilitiesRecessions
		},
		setOptionSelected: (state, action) => {
			state.optionSelected = action.payload
		},
		setTeeth: (state, action) => {
			const tooth = action.payload
			const newTeeth = [...state.teeth]
			const index = state.teeth.findIndex(
				(toothParam) => toothParam.toothId === tooth.toothId
			)
			if (index >= 0) {
				newTeeth.splice(index, 1, tooth)
			} else {
				newTeeth.push(tooth)
			}
			state.teeth = newTeeth
		},
		setIsClickOutsidePalette: (state, action) => {
			state.isClickOutSidePalette = action.payload
		},
		setActa: (state, action) => {
			state.acta = action.payload
		},
		resetStateOnOdontology: (state, action) => {
			state.data = null
			state.generalInfo = initialValues.generalInfo
			state.familyHistory = initialValues.familyHistory
			state.indicator = initialValues.indicator
			state.cpoCeoRatios = initialValues.cpoCeoRatios
			state.planAndDiagnostics = initialValues.planAndDiagnostics
			state.treatments = initialValues.treatments
			state.movilitiesRecessions =
				initialValues.odontogram.movilitiesRecessions
			state.teeth = initialValues.odontogram.teeth
			state.optionSelected = {}
			state.acta = null
			state.isLoading = false
			state.isClickOutSidePalette = false
		},
	},
})

export const {
	setDataForNewConsultation,
	setDataForEdit,
	setLoading,
	setFamilyHistory,
	setGeneralInfo,
	setIndicator,
	setCpoCeoRatios,
	setPlanAndDiagnostics,
	setTreatments,
	setMovilitiesRecessions,
	setOptionSelected,
	setTeeth,
	setIsClickOutsidePalette,
	setActa,
	resetStateOnOdontology,
} = odontologySlice.actions
