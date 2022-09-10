import { Form, message } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { CitationService } from '../services/CitationService'

export const useFetchCitations = () => {
	const [form] = Form.useForm()
	const [citations, setCitations] = useState(null)
	const [loading, setLoading] = useState(false)
	const { visible } = useContext(QrModalContext)
	const [lastSearch, setLastSearch] = useState('')
	const inputRef = useRef()

	const loadCitations = (page) => {
		setLoading(true)
		CitationService.getAllCitations(page)
			.then((data) => {
				console.log(data)
				setCitations(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		loadCitations(1)
	}, [])

	const searchCitations = ({ identification, page }) => {
		if (!identification) return
		console.log(form.getFieldsValue())
		setLoading(true)
		const { startDate, endDate, stateFilter } = form.getFieldsValue()
		CitationService.getCitationsByFilters({
			startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
			endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
			stateFilter,
			identification,
			page,
		})
			.then((data) => {
				console.log(data)
				setCitations(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	/**
	 * Handler para buscar citas
	 * @param {Event} e
	 */
	const handleSubmitSearch = (identification) => {
		setLastSearch(identification)
		searchCitations({ identification, page: 1 })
	}

	const handleReload = () => {
		setLastSearch('')
		loadCitations(1)
	}

	const updatePage = (page) => {
		console.log(inputRef.current)
		//if (!lastSearch) return
		if (lastSearch) searchCitations({ identification: lastSearch, page })
		else loadCitations(page)
	}

	const handleDeleteClick = async (id) => {
		try {
			setLoading(true)
			await CitationService.deleteCitation(id)
			message.success('Registro eliminado correctamente')
			//searchHistory({ ...lastSearch, page: 1 })
			loadCitations(1)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(errorMessage)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return {
		form,
		loading,
		visible,
		citations,
		inputRef,
		handleReload,
		updatePage,
		handleDeleteClick,
		handleSubmitSearch,
	}
}
