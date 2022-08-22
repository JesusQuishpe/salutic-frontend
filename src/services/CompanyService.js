import { axiosDelete, axiosGet, axiosPost } from './axiosRequests'

export const CompanyService = {
	getCompanies: () => axiosGet('empresas'),
	getById: (id) => axiosGet(`empresas/${id}`),
	createCompany: (data) => axiosPost('empresas', data),
	updateCompany: (data, id) => axiosPost(`empresas/${id}`, data), //Se pone post y no put, solo en este caso, porque laravel
	//No analiza datos de formularios de varias partes a menos que el método de solicitud sea POST
	deleteCompany: (id) => axiosDelete(`empresas/${id}`),
}
