import { axiosGet, axiosPut } from './axiosRequests'

export const ExpedientService = {
	getPatientQueue: () => axiosGet(`expedientes?queue=true`),
	getExpedients: (page) => axiosGet(`expedientes?page=${page}`),
	getExpedientByIdentification: (identification) =>
		axiosGet(`expedientes?identification=${identification}`),
	getExpedient: (id) => axiosGet(`expedientes/${id}`),
	updateExpedient: (data, id) => axiosPut(`expedientes/${id}`, data),
}
