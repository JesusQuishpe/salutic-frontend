import { Button, Popconfirm, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { MedConsultationService } from '../../../services/MedConsultationService'
import { setLoading } from '../../../store/slices/expedient/expedientSlice'

export const ConsultationsTab = ({ patientId }) => {
	const [consultations, setConsultations] = useState([])
	const [laoding, setLaoding] = useState(false)

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
							//onConfirm={() => handleDeleteClick(record.id)}
							/*okButtonProps={{
              loading,
            }}*/
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

	const getConsultationsByPatientId = async () => {
		try {
			setLoading(true)
			const results = await MedConsultationService.getByPatientId(
				patientId
			)
			console.log(results)
			setConsultations(results)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getConsultationsByPatientId()
	}, [])

	return (
		<Table
			columns={columns}
			dataSource={consultations}
			rowKey={(record) => record.id}
		/>
	)
}
