import { ExpedientService } from '../../../services/ExpedientService'
import { setExpedient, setLoading, setNotFound } from './expedientSlice'

export const getExpedientById = (id) => {
	return async (dispatch, getState) => {
		dispatch(setLoading(true))
		ExpedientService.getExpedient(id)
			.then((expedient) => {
				console.log(expedient)
				dispatch(setExpedient(expedient))
			})
			.catch((err) => {
				console.log(err)
				dispatch(setNotFound(true))
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}
