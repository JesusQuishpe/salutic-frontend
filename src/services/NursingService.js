import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const NursingService = {
	getPatientQueue: () => axiosGet(`enfermerias`),
	getById: (id) => axiosGet(`enfermerias/${id}`),
	getHistoryByIdentification: (identification) =>
		axiosGet(`enfermerias?history=true&identification=${identification}`),
	create: (data) => axiosPost('enfermerias', data),
	update: (data, id) => axiosPut(`enfermerias/${id}`, data),
	delete: (appoId) => axiosDelete(`enfermeria/citas/${appoId}`),
}
