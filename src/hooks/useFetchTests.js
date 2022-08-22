import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { TestService } from '../services/TestService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchTests = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [tests, setTests] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadTests = () => {
		setLoading(true)
		setFilterText('')
		TestService.getTests()
			.then((data) => {
				console.log(data)
				setTests(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (testId) => {
		try {
			setLoading(true)
			await TestService.deleteTest(testId)
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

	/**
	 * Establece el valor del test en filterText
	 * @param {string} name nombre del test
	 * @returns
	 */
	const handleSearch = (name) => {
		setFilterText(name)
	}

	const handleReload = () => {
		setPage(1)
		loadTests()
	}

	useEffect(() => {
		loadTests()
	}, [])

	return {
		loading,
		tests,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
