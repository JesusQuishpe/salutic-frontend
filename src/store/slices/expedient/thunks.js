import { ExpedientService } from '../../../services/ExpedientService'
import { pickObject } from '../../../utils/functions'
import { setExpedient, setLoading, setPatientExpedient } from './expedientSlice'

const getLifeStyle = (lifestyle) => {
	return {
		smoking: pickObject(lifestyle, [
			'smoke',
			'startSmokingAge',
			'formerSmoker',
			'cigarsPerDay',
			'passiveSmoker',
			'stopSmokingAge',
		]),
		physicalActivity: pickObject(lifestyle, [
			'doExercise',
			'minPerDay',
			'doSport',
			'sportDescription',
			'sportFrequency',
			'sleep',
			'sleepHours',
		]),
		feedingHabits: pickObject(lifestyle, [
			'breakfast',
			'mealsPerDay',
			'drinkCoffe',
			'cupsPerDay',
			'drinkSoda',
			'doDiet',
			'dietDescription',
		]),
		others: pickObject(lifestyle, [
			'workAuthonomy',
			'workShift',
			'hobbies',
			'otherSituations',
		]),
	}
}

export const getExpedientById = (id) => {
	return async (dispatch, getState) => {
		dispatch(setLoading(true))
		ExpedientService.getExpedient(id)
			.then((expedient) => {
				console.log(expedient)
				/*dispatch(
					setPatientExpedient({
						...expedient,
						lifestyle: getLifeStyle(expedient.lifestyle),
					})
				)*/
				dispatch(setExpedient(expedient))
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				dispatch(setLoading(false))
			})
	}
}
