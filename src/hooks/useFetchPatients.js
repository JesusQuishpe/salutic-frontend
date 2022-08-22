import { message } from 'antd'
import { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { PatientService } from '../services/PatientService'

export const useFetchPatients = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [patients, setPatients] = useState(undefined)

	const loadPatients = (page) => {
		setLoading(true)
		PatientService.getAllPatients(page)
			.then((data) => {
				console.log(data)
				setPatients(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const onSearch = (identification) => {
		if (!identification) return
		setLoading(true)
		PatientService.getByIdentification(identification)
			.then((data) => {
				console.log(data)
				setPatients({
					result: [data],
					pagination: {
						total: 1,
						perPage: 10,
						currentPage: 1,
					},
				})
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

	const onReload = () => {
		loadPatients(1)
	}

	useEffect(() => {
		loadPatients(page)
	}, [page])

	const updatePage = (page) => {
		setPage(page)
	}

	return {
		page,
		loading,
		patients,
		visible,
		updatePage,
		onSearch,
		onReload,
	}
}
