import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { UserService } from '../services/UserService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchUsers = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [users, setUsers] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadUsers = () => {
		setLoading(true)
		setFilterText('')
		UserService.getUsers()
			.then((data) => {
				console.log(data)
				setUsers(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (rolId) => {
		try {
			setLoading(true)
			await UserService.deleteUser(rolId)
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
	 * @param {string} name nombre del usuario
	 * @returns
	 */
	const handleSearch = (name) => {
		setFilterText(name)
	}

	const handleReload = () => {
		setPage(1)
		loadUsers()
	}

	useEffect(() => {
		loadUsers()
	}, [])

	return {
		loading,
		users,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
