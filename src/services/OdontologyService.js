import { axiosDelete, axiosGet, axiosPost } from './axiosRequests'

export const OdontologyService = {
	getDataForNewConsultation: (appoId) =>
		axiosGet(`odontologias?q=data&appo_id=${appoId}`),
	getDataForEdit: (recId) => axiosGet(`odontologias/${recId}`),
	getSymbologies: () => axiosGet('odontologia/simbologias'),
	savePatientRecord: (data) => axiosPost('odontologias', data),
	updatePatientRecord: (data, recId) =>
		axiosPost('odontologias/' + recId, data),
	getPatientRecordsByIdentification: (identification) =>
		axiosGet(`odontologia/fichas/${identification}`),
	getPatientQueue: () => axiosGet(`odontologias?q=queue`),
	searchMedicalHistories: ({ identification, startDate, endDate, page }) =>
		axiosGet(
			`odontologias/search?identification=${identification}&start_date=${startDate}&end_date=${endDate}&page=${page}`
		),
	deleteRecord: (id) => axiosDelete(`odontologias/${id}`),
	removeOfQueue: (appoId) =>
		axiosDelete(`odontologia/${appoId}/eliminar-paciente`),
	getActaFile: (recId) => axiosGet(`odontologia/${recId}/acta`),
}
