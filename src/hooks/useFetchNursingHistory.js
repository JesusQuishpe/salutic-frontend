import { message } from 'antd'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import QrModalContext from '../contexts/QrModalContext'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { NursingService } from '../services/NursingService'
import useUser from './useUser'

export const useFetchNursingHistory = () => {
	const { user } = useUser()
	const inputRef = useRef()

	//Contexts
	const { visible } = useContext(QrModalContext)
	//States
	const [parametersModal, setParametersModal] = useState({})
	const [results, setResults] = useState(null)
	const [singleResult, setSingleResult] = useState({})
	const [loading, setLoading] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [resultLoading, setResultLoading] = useState(false)
	const [rowSelected, setRowSelected] = useState(null)
	const [lastSearch, setLastSearch] = useState('')

	/**
	 * Elimina un registro de enfermeria
	 * @param {number} appoId
	 */
	const deleteRecord = useCallback(async (id) => {
		try {
			setConfirmLoading(true)
			//await EnfermeriaService.delete(id)
			setConfirmLoading(false)
		} catch (error) {
			console.log(error)
		} finally {
			setConfirmLoading(false)
		}
	}, [])

	/**
	 * Muestra el modal  para agregar los datos de enfermeria
	 * @param {object} data
	 */
	const openModal = (nurId, appoId) => {
		if (!nurId || !appoId) return
		setParametersModal({
			show: true,
			nurId,
			userId: user?.id,
			appoId,
		})
	}

	/**
	 * Cierra el modal de enfermeria
	 */
	const closeModal = () => {
		setParametersModal({
			show: false,
			appoId: undefined,
			userId: undefined,
		})
	}

	const columns = useMemo(
		() => [
			{
				title: 'N° cita',
				dataIndex: 'appoId',
				width: 100,
			},
			{
				title: 'Paciente',
				dataIndex: 'patient',
			},

			{
				title: 'Fecha',
				dataIndex: 'date',
			},
			{
				title: 'Hora',
				dataIndex: 'hour',
			},
		],
		[]
	)

	/**
	 * Carga los resultados del paciente por cedula
	 * @param {string} identification
	 */
	const searchHistory = async (values) => {
		//console.log(values.startDate.format('YYYY-MM-DD'))
		try {
			setLoading(true)
			const history = await NursingService.getHistoryByIdentification({
				...values,
			})

			if (!history || history.result.length === 0) {
				message.error(
					'No hay resultados para el paciente con CI: ' +
						values.identification
				)
				setResults({ result: [] })
			} else {
				setResults(history)
			}
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
			setResults({ result: [] })
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Handler para buscar los resultados del paciente por cedula
	 * @param {Event} e
	 */
	const handleSubmitSearch = (values) => {
		setLastSearch(values)
		searchHistory({ ...values, page: 1 })
	}

	const loadResult = async (nurId) => {
		try {
			setResultLoading(true)
			const data = await NursingService.getById(nurId)
			console.log(data)
			setSingleResult(data)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			setResultLoading(false)
		}
	}

	const rowSelection = {
		onChange: (_, selectedRows) => {
			const record = selectedRows[0]
			//loadResult(record.nurId)
			setRowSelected(record)
		},
	}

	const handleSeeDetailsClick = () => {
		if (!rowSelected?.nurId) return
		loadResult(rowSelected.nurId)
	}

	const updatePage = (page) => {
		if (!inputRef.current.values && !lastSearch) return
		if (!inputRef.current.values && lastSearch)
			searchHistory({ ...lastSearch, page })
		else searchHistory({ ...inputRef.current.values, page })
	}

	const handleEditClick = () => {
		openModal(rowSelected?.nurId, rowSelected?.appoId)
	}

	return {
		inputRef,
		columns,
		visible,
		parametersModal,
		results,
		singleResult,
		loading,
		confirmLoading,
		resultLoading,
		rowSelection,
		handleSubmitSearch,
		handleSeeDetailsClick,
		handleEditClick,
		updatePage,
		closeModal,
	}
}
