import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const NursingService = {
	getPatientQueue: () => axiosGet(`enfermerias`),
	getById: (id) => axiosGet(`enfermerias/${id}`),
	getHistoryByIdentification: ({
		identification,
		startDate,
		endDate,
		page,
	}) =>
		axiosGet(
			`enfermerias/search?identification=${identification}&start_date=${startDate}&end_date=${endDate}&page=${page}`
		),
	create: (data) => axiosPost('enfermerias', data),
	update: (data, id) => axiosPut(`enfermerias/${id}`, data),
	delete: (appoId) => axiosDelete(`enfermeria/citas/${appoId}`),
	removeOfQueue: (appoId) =>
		axiosDelete(`enfermeria/${appoId}/eliminar-paciente`),
}
