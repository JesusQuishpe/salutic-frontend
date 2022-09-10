import { axiosDelete, axiosGet, axiosPost } from './axiosRequests'

export const CitationService = {
	getAllCitations: (page) => axiosGet(`citas?page=${page}`),
	getCitationsByFilters: ({
		startDate,
		endDate,
		stateFilter,
		identification,
		page,
	}) =>
		axiosGet(
			`citas/search?start_date=${startDate}&end_date=${endDate}&state_filter=${stateFilter}&identification=${identification}&page=${page}`
		),
	getByIdentification: (identification) =>
		axiosGet(`citas?identification=${identification}`),
	createCitation: (data) => axiosPost('citas', data),
	deleteCitation: (id) => axiosDelete(`citas/${id}`),
}
