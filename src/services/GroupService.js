import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const GroupService = {
	getGroups: () => axiosGet('grupos'),
	getById: (id) => axiosGet(`grupos/${id}`),
	createGroup: (data) => axiosPost('grupos', data),
	updateGroup: (data, id) => axiosPut(`grupos/${id}`, data),
	deleteGroup: (id) => axiosDelete(`grupos/${id}`),
}
