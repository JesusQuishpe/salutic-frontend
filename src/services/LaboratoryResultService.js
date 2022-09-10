import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const LaboratoryResultService = {
	saveResults: (results) => axiosPost('resultados', results),
	updateResults: (results, resultId) =>
		axiosPut(`resultados/${resultId}`, results),
	getResultsByIdentification: ({
		identification,
		startDate,
		endDate,
		page,
	}) =>
		axiosGet(
			`resultados/search?identification=${identification}&start_date=${startDate}&end_date=${endDate}&page=${page}`
		),
	getResultById: (resulId) => axiosGet(`resultados/${resulId}`),
	deleteResult: (resultId) => axiosDelete(`resultados/${resultId}`),
}
