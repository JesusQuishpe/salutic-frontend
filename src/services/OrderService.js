import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const OrderService = {
	getOrders: () => axiosGet('ordenes'),
	getById: (id) => axiosGet(`ordenes/${id}`),
	createOrder: (data) => axiosPost('ordenes', data),
	updateOrder: (data, id) => axiosPut(`ordenes/${id}`, data),
	deleteOrder: (id) => axiosDelete(`ordenes/${id}`),
	getPendingOrdersByIdentification: (identification) =>
		axiosGet(`ordenes?pending=true&identification=${identification}`),
	getOrdersByIdentification: (identification) =>
		axiosGet(`ordenes?identification=${identification}`),
}
