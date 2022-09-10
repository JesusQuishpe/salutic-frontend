import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const MedicineService = {
	getMedicines: (page) => axiosGet(`medicamentos?page=${page}`),
	getById: (id) => axiosGet(`medicamentos/${id}`),
	createMedicine: (data) => axiosPost('medicamentos', data),
	updateMedicine: (data, id) => axiosPut(`medicamentos/${id}`, data),
	deleteMedicine: (id) => axiosDelete(`medicamentos/${id}`),
	searchMedicine: ({ medicineName, page }) =>
		axiosGet(
			`medicamentos/search?medicine_name=${medicineName}&page=${page}`
		),
}
