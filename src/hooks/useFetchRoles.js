import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { RolService } from '../services/RolService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchRoles = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [roles, setRoles] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadRoles = () => {
		setLoading(true)
		setFilterText('')
		RolService.getRoles()
			.then((data) => {
				setRoles(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (rolId) => {
		try {
			setLoading(true)
			await RolService.deleteRol(rolId)
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
	 * @param {string} name nombre del rol
	 * @returns
	 */
	const handleSearch = (name) => {
		setFilterText(name)
	}

	const handleReload = () => {
		setPage(1)
		loadRoles()
	}

	useEffect(() => {
		loadRoles()
	}, [])

	return {
		loading,
		roles,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
