import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, Outlet } from 'react-router-dom'
import Table from 'antd/lib/table'
import {
	Button,
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Popconfirm,
	Row,
	Select,
	Space,
	Tag,
} from 'antd'
import { QRModal } from '../qr/QRModal'
import { useFetchCitations } from '../../hooks/useFetchCitations'
import CustomSearch from '../qr/CustomSearch'
import { createDateFromString } from '../../utils/functions'

const { Option } = Select

export const Citations = () => {
	const {
		form,
		inputRef,
		citations,
		loading,
		handleReload,
		updatePage,
		handleDeleteClick,
		handleSubmitSearch,
	} = useFetchCitations()

	const columns = [
		{
			title: 'N° cita',
			dataIndex: 'id',
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
			responsive: ['xl'],
		},
		{
			title: 'Area',
			dataIndex: 'area',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
			responsive: ['lg'],
			render: (_, record) => {
				return createDateFromString(record.date).format('DD/MM/YYYY')
			},
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
			responsive: ['xl'],
		},
		{
			title: 'Estado',
			dataIndex: 'attended',
			responsive: ['md'],
			render: (_, record) => {
				if (record.attended === 1) {
					return <Tag color='green'>Atendida</Tag>
				} else {
					return <Tag color='red'>Pendiente</Tag>
				}
			},
		},
		{
			title: 'Acciones',

			render: (_, record) => {
				return (
					<Space>
						<Popconfirm
							title='Está seguro de eliminar la cita?'
							onConfirm={() => handleDeleteClick(record.id)}
							okButtonProps={{
								loading,
							}}
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

	return (
		<>
			<Outlet />
			<h2>Citas</h2>
			<div style={{ marginBottom: '10px' }}>
				<Link className='btn btn-success' to={'nuevo'}>
					<Button
						type='primary'
						style={{
							background: 'rgb(37,184,100)',
							borderColor: 'rgb(37,184,100)',
							color: '#fff',
						}}
					>
						<FileAddOutlined /> Nuevo
					</Button>
				</Link>
			</div>
			<Row gutter={[10, 10]}>
				<Col xs={24} lg={7} xl={6}>
					<Card title='Filtros'>
						<Form
							form={form}
							initialValues={{
								stateFilter: null,
								startDate: null,
								endDate: null,
							}}
							layout='vertical'
						>
							<Form.Item label='Fecha inicial' name='startDate'>
								<DatePicker
									placeholder='Seleccione fecha'
									style={{ width: '100%' }}
									format='DD/MM/YYYY'
								/>
							</Form.Item>
							<Form.Item label='Fecha final' name='endDate'>
								<DatePicker
									placeholder='Seleccione fecha'
									style={{ width: '100%' }}
									format='DD/MM/YYYY'
								/>
							</Form.Item>
							<Divider />
							<Form.Item
								label='Filtrar por estado'
								name='stateFilter'
							>
								<Select
									placeholder='Seleccione un estado de la cita'
									allowClear
								>
									<Option value='pendientes'>
										Pendientes
									</Option>
									<Option value='atendidas'>Atendidas</Option>
								</Select>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				<Col lg={17} md={24} xs={24} xl={18}>
					<CustomSearch
						ref={inputRef}
						placeholder='Buscar por número de cédula'
						allowClear
						disabled={loading}
						onSearch={handleSubmitSearch}
						onReload={handleReload}
						showQrButton={false}
					/>
					<Table
						columns={columns}
						dataSource={citations?.result}
						rowKey={(record) => record.id}
						pagination={{
							total: citations?.pagination?.total,
							current: citations?.pagination?.currentPage,
							pageSize: citations?.pagination?.perPage,
							onChange: updatePage,
						}}
						loading={loading}
					/>
				</Col>
			</Row>
			{/*{visible && <QRModal handleSearch={onSearch} />}*/}
		</>
	)
}
