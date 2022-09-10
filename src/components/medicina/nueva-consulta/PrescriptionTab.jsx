import { Button, Card, Col, Form, Input, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { SearchMedicineModal } from './SearchMedicineModal'

const initialForm = {
	medicineId: null,
	medicineName: '',
	dosification: '',
}

export const PrescriptionTab = ({ isEdit, data, update }) => {
	const [show, setShow] = useState(false)
	const [form] = Form.useForm()
	const [prescriptions, setPrescriptions] = useState([])

	const deleteMedicine = (id) => {
		const newPrescriptions = prescriptions.filter(
			(pres) => pres.medicineId !== id
		)
		setPrescriptions(newPrescriptions)
		update(newPrescriptions)
	}

	const columns = [
		{
			title: 'Id',
			dataIndex: 'medicineId',
		},
		{
			title: 'Medicamento',
			dataIndex: 'medicineName',
		},
		{
			title: 'Dosificación',
			dataIndex: 'dosification',
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Button
						danger
						onClick={() => deleteMedicine(record.medicineId)}
					>
						<DeleteOutlined />
					</Button>
				)
			},
		},
	]

	const handleSearchClick = () => {
		setShow(true)
	}

	const handleSubmitModal = ({ medicineId, medicineName }) => {
		form.setFieldsValue({
			medicineId,
			medicineName,
		})
	}

	const closeModal = () => {
		setShow(false)
	}

	const addMedicine = (values) => {
		const valuesClone = { ...values }
		const index = prescriptions.findIndex(
			(row) => row.medicineId === values.medicineId
		)
		if (index >= 0) return
		const newPrescriptions = prescriptions.concat(valuesClone)
		setPrescriptions(newPrescriptions)
		update(newPrescriptions)
		form.resetFields()
	}

	useEffect(() => {
		if (data) {
			setPrescriptions(data)
		}
	}, [data])

	return (
		<>
			<Row gutter={20}>
				<Col md={{ span: 24 }} lg={{ span: 8 }}>
					<Card title='Nueva receta'>
						<Form
							style={{ marginBottom: '10px' }}
							layout='vertical'
							form={form}
							onFinish={addMedicine}
							initialValues={initialForm}
						>
							<Form.Item noStyle hidden name='medicineId'>
								<Input hidden />
							</Form.Item>
							<Form.Item label='Medicamento'>
								<Row gutter={10}>
									<Col span={18}>
										<Form.Item
											noStyle
											name='medicineName'
											rules={[
												{
													required: true,
													message:
														'El campo es requerido',
												},
											]}
										>
											<Input disabled />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Button onClick={handleSearchClick}>
											Buscar
										</Button>
									</Col>
								</Row>
							</Form.Item>

							<Form.Item
								label='Dosificación'
								name='dosification'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Input maxLength={150} />
							</Form.Item>
							<Form.Item>
								<Button type='primary' htmlType='submit'>
									Agregar
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				<Col md={{ span: 24 }} lg={{ span: 16 }}>
					<Table
						columns={columns}
						dataSource={prescriptions}
						rowKey={(record) => record.medicineId}
					/>
				</Col>
			</Row>
			<SearchMedicineModal
				show={show}
				closeModal={closeModal}
				onSubmit={handleSubmitModal}
			/>
		</>
	)
}
