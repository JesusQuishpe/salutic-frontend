import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, Outlet } from 'react-router-dom'
import Table from 'antd/lib/table'
import CustomSearch from '../qr/CustomSearch'
import { mapDataForTableAntDesign } from '../../utils/functions'
import {
	Button,
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Row,
	Select,
	Space,
} from 'antd'
import { QRModal } from '../qr/QRModal'
import { useFetchCitations } from '../../hooks/useFetchCitations'

const { Option } = Select

export const Citations = () => {
	const [form] = Form.useForm()
	const {
		page,
		citations,
		loading,
		visible,
		onSearch,
		onReload,
		updatePage,
	} = useFetchCitations()
	const columns = [
		{
			title: 'N° cita',
			dataIndex: 'id',
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
			responsive: ['md'],
		},
		{
			title: 'Area',
			dataIndex: 'area',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
			responsive: ['md'],
		},
		{
			title: 'Acciones',
			responsive: ['md'],
			render: (_, record) => {
				return (
					<Space>
						<Button type='primary' danger>
							<DeleteOutlined />
						</Button>
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
				<Col lg={6} md={24} xs={24}>
					<Card title='Filtros'>
						<Form
							form={form}
							initialValues={{
								stateFilter: 'pendientes',
								startDate: null,
								endDate: null,
							}}
							layout='vertical'
						>
							<Form.Item label='Fecha inicial' name='startDate'>
								<DatePicker
									placeholder='Seleccione fecha'
									style={{ width: '100%' }}
									format='YYYY-MM-DD'
								/>
							</Form.Item>
							<Form.Item label='Fecha final' name='endDate'>
								<DatePicker
									placeholder='Seleccione fecha'
									style={{ width: '100%' }}
									format='YYYY-MM-DD'
								/>
							</Form.Item>
							<Divider />
							<Form.Item
								label='Filtrar por estado'
								name='stateFilter'
							>
								<Select placeholder='Seleccione un estado de la cita'>
									<Option value='pendientes'>
										Pendientes
									</Option>
									<Option value='atendidas'>Atendidas</Option>
								</Select>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				<Col lg={18} md={24} xs={24}>
					<CustomSearch
						placeholder='Buscar por número de cédula'
						allowClear
						disabled={loading}
						onSearch={onSearch}
						onReload={onReload}
					/>
					<Table
						columns={columns}
						dataSource={mapDataForTableAntDesign(citations?.result)}
						pagination={{
							total: citations?.pagination?.total,
							current: page,
							pageSize: citations?.pagination?.perPage,
							onChange: updatePage,
						}}
						loading={loading}
					/>
				</Col>
			</Row>
			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
