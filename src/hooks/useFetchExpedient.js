import { useCallback, useEffect, useState } from 'react'
import { ExpedientService } from '../services/ExpedientService'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getExpedientById } from '../store/slices/expedient/thunks'

export const useFetchExpedient = (expedientId) => {
	const dispatch = useDispatch()
	const { patientExpedient, isLoading } = useSelector(
		(state) => state.expedient
	)
	const [loading, setLoading] = useState(false)
	const [personalInfo, setPersonalInfo] = useState({})
	const [aditionalInfo, setAditionalInfo] = useState({})
	const [patientRecord, setPatientRecord] = useState({})
	const [physicalExploration, setPhysicalExploration] = useState({})
	const [interrogation, setInterrogation] = useState({})
	const [physicalActivity, setPhysicalActivity] = useState({})
	const [smoking, setSmoking] = useState({})
	const [feedingHabits, setFeedingHabits] = useState({})
	const [others, setOthers] = useState({})

	const loadExpediente = useCallback(async (expedientId) => {
		try {
			//let patient = await PatientService.getPatient(expedientId)
			if (isNaN(expedientId)) return
			setLoading(true)
			const expedient = await ExpedientService.getExpedient(expedientId)
			console.log(expedient)

			setAditionalInfo({
				coupleName: expedient?.patient?.coupleName || '',
				fatherName: expedient?.patient?.fatherName || '',
				motherName: expedient?.patient?.motherName || '',
				occupation: expedient?.patient?.occupation || '',
				origin: expedient?.patient?.origin || '',
				maritalStatus: expedient?.patient?.maritalStatus || '',
			})
			setPersonalInfo({
				id: expedient?.patient?.id || null,
				identification: expedient?.patient?.identification || '',
				name: expedient?.patient?.name || '',
				lastname: expedient?.patient?.lastname || '',
				fullname: expedient?.patient?.fullname || '',
				gender: expedient?.patient?.gender || '',
				age: expedient?.patient?.age || 0,
				birthDate: moment(expedient?.patient?.birthDate),
				cellphone: expedient?.patient?.cellphone || '',
				address: expedient?.patient?.address || '',
				city: expedient?.patient?.city || '',
				province: expedient?.patient?.province || '',
				email: expedient?.patient?.email || '',
				notes: expedient?.patient?.notes || '',
			})
			setPatientRecord({
				pathological: expedient?.patientRecord?.pathological || '',
				noPathological: expedient?.patientRecord?.noPathological || '',
				perinatal: expedient?.patientRecord?.perinatal || '',
				gynecological: expedient?.patientRecord?.gynecological || '',
			})
			setPhysicalExploration({
				outerHabitus:
					expedient?.physicalExploration?.outerHabitus || '',
				head: expedient?.physicalExploration?.head || '',
				eyes: expedient?.physicalExploration?.eyes || '',
				otorhinolaryngology:
					expedient?.physicalExploration?.otorhinolaryngology || '',
				neck: expedient?.physicalExploration?.neck || '',
				chest: expedient?.physicalExploration?.chest || '',
				abdomen: expedient?.physicalExploration?.abdomen || '',
				gynecologicalExamination:
					expedient?.physicalExploration?.gynecologicalExamination ||
					'',
				genitals: expedient?.physicalExploration?.genitals || '',
				spine: expedient?.physicalExploration?.spine || '',
				extremities: expedient?.physicalExploration?.extremities || '',
				neurologicalExamination:
					expedient?.physicalExploration?.neurologicalExamination ||
					'',
			})
			setInterrogation({
				cardiovascular: expedient?.interrogation?.cardiovascular || '',
				digestive: expedient?.interrogation?.digestive || '',
				endocrine: expedient?.interrogation?.endocrine || '',
				hemolymphatic: expedient?.interrogation?.hemolymphatic || '',
				mamas: expedient?.interrogation?.mamas || '',
				skeletalMuscle: expedient?.interrogation?.skeletalMuscle || '',
				skinAndAnnexes: expedient?.interrogation?.skinAndAnnexes || '',
				reproductive: expedient?.interrogation?.reproductive || '',
				respiratory: expedient?.interrogation?.respiratory || '',
				nervousSystem: expedient?.interrogation?.nervousSystem || '',
				generalSystems: expedient?.interrogation?.generalSystems || '',
				urinary: expedient?.interrogation?.urinary || '',
			})
			setPhysicalActivity({
				doExercise: expedient?.lifeStyle?.doExercise || false,
				minPerDay: expedient?.lifeStyle?.minPerDay || 0,
				doSport: expedient?.lifeStyle?.doSport || false,
				sportDescription: expedient?.lifeStyle?.sportDescription || '',
				sportFrequency: expedient?.lifeStyle?.sportFrequency || '',
				sleep: expedient?.lifeStyle?.sleep || false,
				sleepHours: expedient?.lifeStyle?.sleepHours || 0,
			})
			setSmoking({
				smoke: expedient?.lifeStyle?.smoke || false,
				startSmokingAge: expedient?.lifeStyle?.startSmokingAge || 0,
				formerSmoker: expedient?.lifeStyle?.formerSmoker || false,
				cigarsPerDay: expedient?.lifeStyle?.cigarsPerDay || 0,
				passiveSmoker: expedient?.lifeStyle?.passiveSmoker || false,
				stopSmokingAge: expedient?.lifeStyle?.stopSmokingAge || 0,
			})
			setFeedingHabits({
				breakfast: expedient?.lifeStyle?.breakfast || false,
				mealsPerDay: expedient?.lifeStyle?.mealsPerDay || 0,
				drinkCoffe: expedient?.lifeStyle?.drinkCoffe || false,
				cupsPerDay: expedient?.lifeStyle?.cupsPerDay || 0,
				drinkSoda: expedient?.lifeStyle?.drinkSoda || false,
				doDiet: expedient?.lifeStyle?.doDiet || false,
				dietDescription: expedient?.lifeStyle?.dietDescription || '',
			})
			setOthers({
				workAuthonomy: expedient?.lifeStyle?.workAuthonomy || false,
				workShift: expedient?.lifeStyle?.workShift || '',
				hobbies: expedient?.lifeStyle?.hobbies || '',
				otherSituations: expedient?.lifeStyle?.otherSituations || '',
			})

			/*setAlergias({
          description: expedient?.alergias?.description || '',
        })*/
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}, [])

	console.log(patientExpedient)
	useEffect(() => {
		//loadExpediente(expedientId)
		dispatch(getExpedientById(1))
		console.log('HOLA')
	}, [])

	return {
		loading,
		personalInfo,
		aditionalInfo,
		patientRecord,
		physicalExploration,
		interrogation,
		physicalActivity,
		smoking,
		feedingHabits,
		others,
		patientExpedient,
		isLoading,
		setPersonalInfo,
		setAditionalInfo,
		setPatientRecord,
		setPhysicalExploration,
		setInterrogation,
		setPhysicalActivity,
		setSmoking,
		setFeedingHabits,
		setOthers,
	}
}
