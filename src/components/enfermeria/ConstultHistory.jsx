import { Button, Card, Col, Descriptions, Row, Space, Spin, Table } from 'antd'

import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import NursingModal from './NursingModal'
import { QRModal } from '../qr/QRModal'
import { useFetchNursingHistory } from '../../hooks/useFetchNursingHistory'
import CustomFilterSearch from '../qr/CustomFilterSearch'

export const ConstultHistory = () => {
	const {
		inputRef,
		visible,
		results,
		singleResult,
		rowSelection,
		columns,
		loading,
		resultLoading,
		parametersModal,
		closeModal,
		handleSeeDetailsClick,
		handleEditClick,
		handleSubmitSearch,
		updatePage,
	} = useFetchNursingHistory()

	return (
		<div className='p-4'>
			<h2 className='mb-4'>Consultar historial</h2>
			<CustomFilterSearch
				ref={inputRef}
				placeholder='Cédula del paciente'
				allowClear
				onSearch={handleSubmitSearch}
				cardType='inner'
			/>

			<Card title='Resultados' type='inner'>
				<Row gutter={20}>
					<Col span={14}>
						<Row justify='end' style={{ marginBottom: '10px' }}>
							<Space>
								<Button onClick={handleSeeDetailsClick}>
									<EyeOutlined />
									Ver detalles
								</Button>
								<Button
									type='primary'
									onClick={handleEditClick}
								>
									<EditOutlined /> Editar
								</Button>
							</Space>
						</Row>
						<Table
							columns={columns}
							dataSource={results?.result}
							loading={loading}
							size='small'
							rowKey={(record) => record.appoId}
							rowSelection={{
								type: 'radio',
								...rowSelection,
							}}
							pagination={{
								total: results?.pagination?.total || 0,
								current: results?.pagination?.currentPage || 1,
								pageSize: results?.pagination?.perPage || 10,
								onChange: updatePage,
							}}
						/>
					</Col>
					<Col span={10}>
						<Card style={{ marginBottom: '10px' }}>
							<Spin spinning={resultLoading}>
								<Descriptions
									title='Información del paciente'
									column={1}
								>
									<Descriptions.Item label='Peso (kg)'>
										{singleResult.weight}
									</Descriptions.Item>
									<Descriptions.Item label='Estatura (cm)'>
										{singleResult.stature}
									</Descriptions.Item>
									<Descriptions.Item label='I.M.C'>
										{singleResult.imc}
									</Descriptions.Item>
									<Descriptions.Item label='Diagnóstico I.M.C'>
										{singleResult.imcDiagnostic}
									</Descriptions.Item>
									<Descriptions.Item label='Frec. Respiratoria (x minuto)'>
										{singleResult.breathingFrequency}
									</Descriptions.Item>
									<Descriptions.Item label='Nivel de discapacidad (%)'>
										{singleResult.disability}
									</Descriptions.Item>
									<Descriptions.Item label='Presión'>
										{singleResult.pressure}
									</Descriptions.Item>
									<Descriptions.Item label='Temperatura (°C)'>
										{singleResult.temperature}
									</Descriptions.Item>
									<Descriptions.Item label='Frec. Cardiaca (x minuto)'>
										{singleResult.heartFrequency}
									</Descriptions.Item>
								</Descriptions>
							</Spin>
						</Card>
					</Col>
				</Row>
			</Card>
			<NursingModal
				closeModal={closeModal}
				parameters={parametersModal}
			/>
			{visible && <QRModal handleSearch={handleSubmitSearch} />}
		</div>
	)
}
