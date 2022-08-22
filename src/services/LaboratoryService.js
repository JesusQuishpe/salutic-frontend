import { axiosGet } from './axiosRequests'

export const LaboratoryService = {
	getAreas: () => axiosGet('areas'),
	getResults: (patientId) => axiosGet(`resultados?patient_id=${patientId}`),
	getResultJSONById: (resultId) =>
		axiosGet(`resultados?result_id=${resultId}&result_details=true`),
}
