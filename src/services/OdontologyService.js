import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

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
	getMedicalHistoryByIdentification: (identification) =>
		axiosGet(`odontologias?q=history&identification=${identification}`),
	deleteRecord: (id) => axiosDelete(`odontologias/${id}`),
}
