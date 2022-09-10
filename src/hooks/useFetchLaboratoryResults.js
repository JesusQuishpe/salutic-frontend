import { useContext, useRef, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { LaboratoryResultService } from '../services/LaboratoryResultService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchLaboratoryResults = () => {
	const { visible } = useContext(QrModalContext)
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState(null)
	const [lastSearch, setLastSearch] = useState('')
	const formRef = useRef()

	const searchHistory = (values) => {
		setLoading(true)
		LaboratoryResultService.getResultsByIdentification(values)
			.then((history) => {
				console.log(history)
				if (!history || history.result.length === 0) {
					message.error(
						'No hay resultados para el paciente con CI: ' +
							values.identification
					)
					setResults({ result: [] })
				} else {
					setResults(history)
				}
			})
			.catch((error) => {
				const { message: errorMessage } = axiosErrorHandler(error)
				message.error(errorMessage)
				setResults({ result: [] })
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (resultId) => {
		try {
			setLoading(true)
			await LaboratoryResultService.deleteResult(resultId)
			message.success('Registro eliminado correctamente')
			//handleReload()
			searchHistory({ ...lastSearch, page: 1 })
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(errorMessage)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Handler para buscar los resultados del paciente por cedula
	 * @param {Event} e
	 */
	const handleSubmitSearch = (values) => {
		setLastSearch(values)
		searchHistory({ ...values, page: 1 })
	}

	const updatePage = (page) => {
		if (!formRef.current.values && !lastSearch) return
		if (!formRef.current.values && lastSearch)
			searchHistory({ ...lastSearch, page })
		else searchHistory({ ...formRef.current.values, page })
	}

	return {
		formRef,
		loading,
		results,
		visible,
		searchHistory,
		handleDeleteClick,
		handleSubmitSearch,
		updatePage,
	}
}
