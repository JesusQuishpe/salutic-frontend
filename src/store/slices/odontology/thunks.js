import { OdontologyService } from '../../../services/OdontologyService'
import {
	setDataForEdit,
	setDataForNewConsultation,
	setLoading,
} from './odontologySlice'

export const getData = (appoId) => {
	return async (dispatch) => {
		dispatch(setLoading(true))
		OdontologyService.getDataForNewConsultation(appoId)
			.then((data) => {
				console.log(data)
				dispatch(setDataForNewConsultation(data))
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}
export const getDataForEdit = (recId) => {
	return async (dispatch) => {
		dispatch(setLoading(true))
		OdontologyService.getDataForEdit(recId)
			.then((data) => {
				console.log(data)
				dispatch(setDataForEdit({ ...data, isEdit: true }))
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}
