import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const AreaService = {
	getAreas: () => axiosGet('areas'),
	getAreasWithGroupsAndTests: () => axiosGet('areas?groups=true&tests=true'),
	getById: (id) => axiosGet(`areas/${id}`),
	createArea: (data) => axiosPost('areas', data),
	updateArea: (data, id) => axiosPut(`areas/${id}`, data),
	deleteArea: (id) => axiosDelete(`areas/${id}`),
}
