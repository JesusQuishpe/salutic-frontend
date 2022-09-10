import { message } from 'antd'
import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { CieService } from '../services/CieService'
import { useLoader } from './useLoader'

export const useFetchCies = () => {
	const { openLoader, closeLoader } = useLoader()
	const { visible } = useContext(QrModalContext)
	const [cies, setCies] = useState(null)
	const [rowSelected, setRowSelected] = useState(null)
	const [loading, setLoading] = useState(false)
	const [lastSearch, setLastSearch] = useState(null)
	const [modalParams, setModalParams] = useState(null)
	const [show, setShow] = useState(false)

	const columns = [
		{
			title: 'Código',
			dataIndex: 'code',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Nombre',
			dataIndex: 'disease',
			ellipsis: true,
		},
	]

	const rowSelection = {
		//selectedRowKeys: [rowSelected?.id],
		onChange: (selectedRowKeys, selectedRows) => {
			const cie = selectedRows[0]
			console.log(cie)
			setRowSelected(cie)
		},
	}

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
		openLoader('Eliminando cie...')
		CieService.deleteCie(rowSelected.id)
			.then(() => {
				message.success('Cie eliminado correctamente')
				loadCies(1)
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

	const openModalConfirmation = () => {
		if (!rowSelected) return
		setShow(true)
	}

	const closeModalConfirmation = () => {
		setShow(false)
	}

	const loadCies = (page) => {
		setLoading(true)
		CieService.getCies(page)
			.then((data) => {
				console.log(data)
				setCies(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const searchCie = ({ name, page }) => {
		if (!name) return
		setLoading(true)
		CieService.searchCie({ name, page })
			.then((cies) => {
				setCies(cies)
			})
			.catch((err) => {
				const { message: errorMessage } = axiosErrorHandler(err)
				console.log(err)
				message.error(errorMessage)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const handleSearch = (value) => {
		setLastSearch(value)
		searchCie({ name: value, page: 1 })
	}

	const handleReload = () => {
		setLastSearch(null)
		setRowSelected(null)
		loadCies(1)
	}

	useEffect(() => {
		loadCies(1)
	}, [])

	const updatePage = (page) => {
		if (lastSearch) {
			searchCie({ name: lastSearch, page })
		} else {
			loadCies(page)
		}
	}

	const updateRowSelected = (value) => {
		setRowSelected(value)
	}
	return {
		columns,
		rowSelection,
		rowSelected,
		loading,
		cies,
		visible,
		show,
		modalParams,
		loadCies,
		closeModal,
		updatePage,
		updateRowSelected,
		handleSearch,
		handleReload,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		openModalConfirmation,
		closeModalConfirmation,
	}
}
