import { axiosGet, axiosPost } from './axiosRequests'

export const CitationService = {
	getAllCitations: () => axiosGet('citas'),
	getByIdentification: (identification) =>
		axiosGet(`citas?identification=${identification}`),
	createCitation: (data) => axiosPost('citas', data),
	/*getSingleCitation:(id:number):Promise<Citation> => axios.get(`citas/${id}`).then(responseBody),
  createCitation:(citation:Citation):Promise<Citation> =>axios.post('citas',citation).then(responseBody),
  updateCitation:(id:number,citation:Citation):Promise<Citation> =>axios.put(`citas/${id}`,citation).then(responseBody),
  getCitationsWithFilters:(filters:CitationFilterProps):Promise<CitationTableData>=>axios.get<CitationTableData[]>('citas').then(responseBody),*/
}
