import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { AreaService } from '../services/AreaService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchAreas = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [areas, setAreas] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadAreas = () => {
		setLoading(true)
		setFilterText('')
		AreaService.getAreas()
			.then((data) => {
				console.log(data)
				setAreas(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (areaId) => {
		try {
			setLoading(true)
			await AreaService.deleteArea(areaId)
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
	 * Busca
	 * @param {string} name nombre del area
	 * @returns
	 */
	const handleSearch = (name) => {
		setFilterText(name)
	}

	const handleReload = () => {
		setPage(1)
		loadAreas()
	}

	useEffect(() => {
		loadAreas()
	}, [])

	return {
		loading,
		areas,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
