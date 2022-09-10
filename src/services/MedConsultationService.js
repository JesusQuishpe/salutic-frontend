import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const MedConsultationService = {
	getConsultations: () => axiosGet('med-consultations'),
	getDataForNewConsultation: (appoId) =>
		axiosGet(`med-consultations?new_consultation=true&appo_id=${appoId}`),
	getById: (id) => axiosGet(`med-consultations/${id}`),
	search: ({ patientId, page, startDate, endDate }) =>
		axiosGet(
			`med-consultations/search?patient_id=${patientId}&start_date=${startDate}&end_date=${endDate}&page=${page}`
		),
	createConsultation: (data) => axiosPost('med-consultations', data),
	updateConsultation: (data, id) => axiosPut(`med-consultations/${id}`, data),
	deleteConsultation: (id) => axiosDelete(`med-consultations/${id}`),
	removeOfQueue: (appoId) =>
		axiosDelete(`medicina/${appoId}/eliminar-paciente`),
}
