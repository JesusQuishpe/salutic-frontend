import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { MedicineService } from '../services/MedicineService'
import { useLoader } from './useLoader'

export const useFetchMedicines = () => {
	const { openLoader, closeLoader } = useLoader()
	const [medicines, setMedicines] = useState(null)
	const [modalParams, setModalParams] = useState(null)
	const [loading, setLoading] = useState(false)
	const [rowSelected, setRowSelected] = useState(null)
	const [lastSearch, setLastSearch] = useState(null)
	const searchRef = useRef()
	const [show, setShow] = useState(false)

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'genericName',
			ellipsis: true,
		},
		{
			title: 'Forma farmacéutica (Concentración)',
			dataIndex: 'pharmaceuticalForm',
			ellipsis: true,
			responsive: ['lg'],
		},
		{
			title: 'Presentación',
			dataIndex: 'presentation',
			responsive: ['md'],
		},
	]

	const rowSelection = {
		onChange: (_, selectedRows) => {
			const row = selectedRows[0]
			console.log(row)
			setRowSelected(row)
		},
	}

	const loadMedicines = (page) => {
		setLoading(true)
		MedicineService.getMedicines(page)
			.then((medicines) => {
				setMedicines(medicines)
			})
			.catch((error) => {
				const { message: errorMessage } = axiosErrorHandler(error)
				console.log(errorMessage)
				message.error(errorMessage)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const searchMedicine = ({ medicineName, page }) => {
		if (!medicineName) return
		setLoading(true)
		MedicineService.searchMedicine({ medicineName, page })
			.then((medicines) => {
				setMedicines(medicines)
			})
			.catch((error) => {
				const { message: errorMessage } = axiosErrorHandler(error)
				console.log(errorMessage)
				message.error(errorMessage)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const handleReload = () => {
		setLastSearch(null)
		loadMedicines(1)
	}

	useEffect(() => {
		loadMedicines(1)
	}, [])

	const closeModal = () => {
		setModalParams({
			show: false,
			data: null,
		})
	}

	const handleAddClick = () => {
		setModalParams({
			show: true,
			data: null,
		})
	}

	const handleEditClick = () => {
		if (!rowSelected) return
		setModalParams({
			show: true,
			data: rowSelected,
		})
	}

	const handleDeleteClick = () => {
		openLoader('Eliminando medicamento...')
		MedicineService.deleteMedicine(rowSelected.id)
			.then(() => {
				message.success('Medicamento eliminado correctamente')
				loadMedicines(1)
				closeModalConfirmation()
			})
			.catch((error) => {
				const { message: errorMessage } = axiosErrorHandler(error)
				console.log(errorMessage)
				message.error(errorMessage)
			})
			.finally(() => {
				setLoading(false)
				closeLoader()
			})
	}

	const updatePage = (page) => {
		if (lastSearch) {
			searchMedicine({ medicineName: lastSearch, page })
		} else {
			loadMedicines(page)
		}
	}

	const handleSearch = (value) => {
		setLastSearch(value)
		searchMedicine({ medicineName: value, page: 1 })
	}

	const openModalConfirmation = () => {
		if (!rowSelected) return
		setShow(true)
	}

	const closeModalConfirmation = () => {
		setShow(false)
	}

	const updateRowSelected = (value) => {
		setRowSelected(value)
	}

	return {
		medicines,
		modalParams,
		loading,
		columns,
		rowSelection,
		rowSelected,
		searchRef,
		show,
		openModalConfirmation,
		closeModalConfirmation,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		handleReload,
		handleSearch,
		updatePage,
		updateRowSelected,
		loadMedicines,
		closeModal,
	}
}
