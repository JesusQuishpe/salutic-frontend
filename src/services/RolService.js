import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const RolService = {
	getRoles: () => axiosGet('roles'),
	getById: (id) => axiosGet(`roles/${id}`),
	createRol: (data) => axiosPost('roles', data),
	updateRol: (data, id) => axiosPut(`roles/${id}`, data),
	deleteRol: (id) => axiosDelete(`roles/${id}`),
}
