import { useContext, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { OdontologyService } from '../services/OdontologyService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchOdontologyHistory = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [filterText, setFilterText] = useState('')

	const searchResults = (identification) => {
		setLoading(true)
		setFilterText('')
		OdontologyService.getMedicalHistoryByIdentification(identification)
			.then((data) => {
				console.log(data)
				setResults(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (recId) => {
		try {
			setLoading(true)
			await OdontologyService.deleteRecord(recId)
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
