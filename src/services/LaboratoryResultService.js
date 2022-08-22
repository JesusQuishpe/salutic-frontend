import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

export const LaboratoryResultService = {
	saveResults: (results) => axiosPost('resultados', results),
	updateResults: (results, resultId) =>
		axiosPut(`resultados/${resultId}`, results),
	getResultsByIdentification: (identification) =>
		axiosGet(`resultados?identification=${identification}`),
	getResultById: (resulId) => axiosGet(`resultados/${resulId}`),
}
