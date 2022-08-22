import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { GroupService } from '../services/GroupService'
import { message } from 'antd'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'

export const useFetchGroups = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [groups, setGroups] = useState([])
	const [filterText, setFilterText] = useState('')

	const loadGroups = () => {
		setLoading(true)
		setFilterText('')
		GroupService.getGroups()
			.then((data) => {
				console.log(data)
				setGroups(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const handleDeleteClick = async (groupId) => {
		try {
			setLoading(true)
			await GroupService.deleteGroup(groupId)
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
	 * @param {string} name nombre del group
	 * @returns
	 */
	const handleSearch = (name) => {
		setFilterText(name)
	}

	const handleReload = () => {
		setPage(1)
		loadGroups()
	}

	useEffect(() => {
		loadGroups()
	}, [])

	return {
		loading,
		groups,
		visible,
		filterText,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	}
}
