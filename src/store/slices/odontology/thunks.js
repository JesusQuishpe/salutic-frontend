import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import { OdontologyService } from '../../../services/OdontologyService'
import {
	setDataForEdit,
	setDataForNewConsultation,
	setLoading,
	setOdoCitationError,
} from './odontologySlice'

export const getDataForEdit = (recId) => {
	return (dispatch) => {
		dispatch(setLoading(true))
		OdontologyService.getDataForEdit(recId)
			.then((data) => {
				console.log(data)
				dispatch(setDataForEdit({ ...data, isEdit: true }))
			})
			.catch((error) => {
				console.log(error)
				const { message: errorMessage, status } =
					axiosErrorHandler(error)
				console.log(status)
				if (status === 404) {
					dispatch(
						setOdoCitationError({ message: errorMessage, status })
					)
				}
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}

export const getData = (appoId) => {
	return async (dispatch) => {
		dispatch(setLoading(true))
		OdontologyService.getDataForNewConsultation(appoId)
			.then((data) => {
				console.log(data)
				dispatch(setDataForNewConsultation(data))
			})
			.catch((error) => {
				console.log(error)
				const { message: errorMessage, status } =
					axiosErrorHandler(error)
				console.log(status)
				if (status === 404) {
					dispatch(
						setOdoCitationError({ message: errorMessage, status })
					)
				}
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}
/*export const getDataForEdit = (recId) => {
	return async (dispatch) => {
		dispatch(setLoading(true))
		OdontologyService.getDataForEdit(recId)
			.then((data) => {
				console.log(data)
				dispatch(setDataForEdit({ ...data, isEdit: true }))

			})
			.catch((error) => {
				console.log(error)
				const { message: errorMessage, status } =
					axiosErrorHandler(error)
				console.log(status)
				if (status === 404) {
					dispatch(
						setOdoCitationError({ message: errorMessage, status })
					)
				}
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}*/
