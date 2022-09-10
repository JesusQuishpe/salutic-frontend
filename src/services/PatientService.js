import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const PatientService = {
	getAllPatients: (page) => axiosGet(`patients?page=${page}`),
	getById: (id) => axiosGet(`patients/${id}`),
	getByIdentification: (identification) =>
		axiosGet(`patients?identification=${identification}`),
	createPatient: (data) => axiosPost('patients', data),
	updatePatient: (data, id) => axiosPut(`patients/${id}`, data),
	deletePatient: (id) => axiosDelete(`patients/${id}`),
}
