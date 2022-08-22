import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const TestService = {
	getTests: () => axiosGet('pruebas'),
	getById: (id) => axiosGet(`pruebas/${id}`),
	createTest: (data) => axiosPost('pruebas', data),
	updateTest: (data, id) => axiosPut(`pruebas/${id}`, data),
	deleteTest: (id) => axiosDelete(`pruebas/${id}`),
}
