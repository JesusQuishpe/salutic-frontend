import { Button, message, Popconfirm, Space, Table } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { MedConsultationService } from '../../../services/MedConsultationService'
import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import CustomFilterSearch from '../../qr/CustomFilterSearch'
import { createDateFromString } from '../../../utils/functions'

export const ConsultationsTab = ({ patientId }) => {
	const formSearch = useRef()
	const [consultations, setConsultations] = useState([])
	const [loading, setLoading] = useState(false)

	const searchConsultationsByPatientId = async (values) => {
		try {
			setLoading(true)
			const results = await MedConsultationService.search(values)
			console.log(results)
			setConsultations(results)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteClick = async (consultationId) => {
		try {
			setLoading(true)
			await MedConsultationService.deleteConsultation(consultationId)
			searchConsultationsByPatientId({
				...formSearch.current.values,
				patientId,
				page: 1,
			})
			message.success('Consulta eliminada correctamente')
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{
			title: 'N° consulta',
			dataIndex: 'id',
		},
		{
			title: 'Tipo de consulta',
			dataIndex: 'consultationType',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
      render:(_,record)=>createDateFromString(record.date).format('DD/MM/YYYY')
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Link
							to={`/medicina/citas/${record.id}/editar`}
							state={{ isEdit: true }}
						>
							<Button type='primary'>
								<EditOutlined />
							</Button>
						</Link>
						<Popconfirm
							title='Está seguro de eliminar?'
							onConfirm={() => handleDeleteClick(record.id)}
							okButtonProps={{
								loading,
							}}
							//onCancel={() => setVisible(false)}
						>
							<Button type='primary' danger>
								<DeleteOutlined />
							</Button>
						</Popconfirm>
					</Space>
				)
			},
		},
	]

	useEffect(() => {
		searchConsultationsByPatientId({ patientId, page: 1 })
	}, [])

	const handleSubmitSearch = (values) => {
		searchConsultationsByPatientId({ ...values, patientId, page: 1 })
	}

	const updatePage = (page) => {
		searchConsultationsByPatientId({
			...formSearch.current.values,
			patientId,
			page,
		})
	}

	return (
		<>
			<CustomFilterSearch
				ref={formSearch}
				placeholder='Cédula del paciente'
				allowClear
				onSearch={handleSubmitSearch}
				cardType=''
				identificationHidden={true}
			/>
			<Table
				bordered
				size='small'
				columns={columns}
				dataSource={consultations?.result}
				rowKey={(record) => record.id}
				pagination={{
					total: consultations?.pagination?.total || 0,
					current: consultations?.pagination?.currentPage || 1,
					pageSize: consultations?.pagination?.perPage || 10,
					onChange: updatePage,
				}}
			/>
		</>
	)
}
