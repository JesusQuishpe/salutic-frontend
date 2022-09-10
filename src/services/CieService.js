import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const CieService = {
	getCies: (page) => axiosGet(`cies?page=${page}`),
	searchCieByName: (cieName) => axiosGet(`cies?disease=${cieName}`),
	searchCie: ({ name, page }) =>
		axiosGet(`cies/search?name=${name}&page=${page}`),
	createCie: (data) => axiosPost('cies', data),
	updateCie: (data, id) => axiosPut(`cies/${id}`, data),
	deleteCie: (id) => axiosDelete(`cies/${id}`),
}
