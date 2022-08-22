import { message } from 'antd'
import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { CieService } from '../services/CieService'

export const useFetchCies = () => {
	const { visible } = useContext(QrModalContext)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [cies, setCies] = useState(null)
	const [isSearch, setIsSearch] = useState(false)
	const [searchValue, setSearchValue] = useState('')

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

	const searchCie = (page) => {
		CieService.searchCieByDiseasePagination(searchValue, page)
			.then((data) => {
				console.log(data)
				setCies({
					result: [...data.result],
					pagination: {
						total: data.pagination.total,
						perPage: data.pagination.perPage,
						currentPage: data.pagination.currentPage,
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

	const handleSearch = () => {
		if (!searchValue) return
		if (!isSearch) {
			setPage(1)
		}
		setIsSearch(true)
	}

	const handleReload = () => {
		setPage(1)
		setSearchValue('')
		setIsSearch(false)
		loadCies(1)
	}

	useEffect(() => {
		loadCies(1)
	}, [])

	useEffect(() => {
		if (isSearch) {
			searchCie(page)
		} else {
			loadCies(page)
		}
	}, [page, isSearch])

	const updatePage = (page) => {
		setPage(page)
	}

	const updateSearchValue = (value) => setSearchValue(value)

	return {
		page,
		searchValue,
		isSearch,
		loading,
		cies,
		visible,
		updatePage,
		updateSearchValue,
		handleSearch,
		handleReload,
	}
}
