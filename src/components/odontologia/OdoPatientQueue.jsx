import { Button, Col, Popconfirm, Row, Space, Table } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QrModalContext from '../../contexts/QrModalContext'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import CustomSearch from '../qr/CustomSearch'
import { QRModal } from '../qr/QRModal'
import { OdontologyService } from '../../services/OdontologyService'

export const OdoPatientQueue = () => {
	//Contexts
	const { visible } = useContext(QrModalContext)
	//States
	const [filterText, setFilterText] = useState('')
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	//Other hooks
	const navigate = useNavigate()

	const deleteRecord = async (nurId) => {
		try {
			await OdontologyService.deleteRecord(nurId)
			loadPatientQueue()
			//console.log(props);
		} catch (error) {
			console.log(error)
		}
	}

	const columns = [
		{
			title: 'N° cita',
			dataIndex: 'appoId',
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
		{
			title: 'Acciones',
			render: (_, record) => {
				const onClick = () => {
					navigate(`/odontologia/citas/${record.appoId}/nuevo`)
				}

				return (
					<Space>
						<Button type='primary' onClick={onClick}>
							<FileAddOutlined />
						</Button>
						<Popconfirm
							title='Está seguro de eliminar?'
							onConfirm={() => deleteRecord(record.appoId)}
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

	const loadPatientQueue = async () => {
		try {
			setLoading(true)
			const patients = await OdontologyService.getPatientQueue()
			console.log(patients)
			setData(
				patients.map((item) => {
					return {
						key: item.appoId,
						...item,
					}
				})
			)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Handler para recargar los pacientes en espera
	 */
	const handleReload = () => {
		setFilterText('')
		loadPatientQueue()
	}

	const onSearch = (identification) => {
		setFilterText(identification)
	}

	useEffect(() => {
		loadPatientQueue()
	}, [])

	return (
		<>
			<div className='w-100 p-4'>
				<h2 style={{ marginBottom: '20px' }}>Area de odontologia</h2>
				<Row gutter={3}>
					<Col flex={5}>
						<CustomSearch
							onSearch={onSearch}
							onReload={handleReload}
							allowClear
							placeholder={'Buscar paciente por número de cédula'}
						/>
					</Col>
				</Row>
				<Table
					columns={columns}
					dataSource={data.filter((row) =>
						row.identification.includes(filterText)
					)}
					pagination
					loading={loading}
				/>
			</div>
			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
