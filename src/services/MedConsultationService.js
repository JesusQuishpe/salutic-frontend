import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const MedConsultationService = {
	getConsultations: () => axiosGet('med-consultations'),
	getDataForNewConsultation: (appoId) =>
		axiosGet(`med-consultations?new_consultation=true&appo_id=${appoId}`),
	getById: (id) => axiosGet(`med-consultations/${id}`),
	getByPatientId: (patientId) =>
		axiosGet(`med-consultations?patient_id=${patientId}`),
	createConsultation: (data) => axiosPost('med-consultations', data),
	updateConsultation: (data, id) => axiosPut(`med-consultations/${id}`, data),
	deleteConsultation: (id) => axiosDelete(`med-consultations/${id}`),
}
