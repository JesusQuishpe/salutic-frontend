import { useContext, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { LaboratoryResultService } from '../services/LaboratoryResultService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchLaboratoryResults = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [filterText, setFilterText] = useState('')

	const searchResults = (identification) => {
		setLoading(true)
		setFilterText('')
		LaboratoryResultService.getResultsByIdentification(identification)
			.then((data) => {
				console.log(data)
				setResults(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (resultId) => {
		try {
			setLoading(true)
			await LaboratoryResultService.deleteResult(resultId)
			message.success('Registro eliminado correctamente')
			handleReload()
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(errorMessage)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	const handleReload = () => {
		setPage(1)
		setResults([])
	}

	return {
		loading,
		results,
		visible,
		filterText,
		page,
		searchResults,
		handleDeleteClick,
		setPage,
	}
}
