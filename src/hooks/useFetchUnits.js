import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { MeasurementUnitService } from '../services/MeasurementUnitService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchUnits = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [units, setUnits] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadUnits = () => {
		setLoading(true)
		setFilterText('')
		MeasurementUnitService.getUnits()
			.then((data) => {
				console.log(data)
				setUnits(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (areaId) => {
		try {
			setLoading(true)
			await MeasurementUnitService.deleteUnit(areaId)
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
		loadUnits()
	}

	useEffect(() => {
		loadUnits()
	}, [])

	return {
		loading,
		units,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
