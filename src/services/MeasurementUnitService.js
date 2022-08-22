import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const MeasurementUnitService = {
	getUnits: () => axiosGet('unidades'),
	getById: (id) => axiosGet(`unidades/${id}`),
	createUnit: (data) => axiosPost('unidades', data),
	updateUnit: (data, id) => axiosPut(`unidades/${id}`, data),
	deleteUnit: (id) => axiosDelete(`unidades/${id}`),
}
