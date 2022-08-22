import { axiosGet } from './axiosRequests'

export const CieService = {
	getCies: (page) => axiosGet(`cies?page=${page}`),
	searchCieByName: (cieName) => axiosGet(`cies?disease=${cieName}`),
	searchCieByDiseasePagination: (cieName, page) =>
		axiosGet(`cies/search?field=disease&value=${cieName}&page=${page}`),
}
