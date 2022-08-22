import { Button, Checkbox, Col, Form, Input, Row, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
	FileAddOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons'
import OdoDiagnosticModal from './OdoDiagnosticModal'
import { setPlanAndDiagnostics } from '../../../store/slices/odontology/odontologySlice'

const { TextArea } = Input

const loadPlansCheckBoxes = (plans) => {
	let checkboxes = []
	if (!plans) return 'No se pudo cargar los planes'
	checkboxes = plans.map((plan) => {
		return (
			<Row key={plan.id}>
				<Checkbox value={plan.id}>{plan.name}</Checkbox>
			</Row>
		)
	})
	return checkboxes
}

const OdoDiagnosticsTab = ({
	diagnosticsfromDB,
	planDiagnostic,
	plans,
	update,
}) => {
	const [form] = Form.useForm()
	const [diagnostics, setDiagnostics] = useState([])
	const [modalParams, setModalParams] = useState({})
	const [selectedRow, setSelectedRow] = useState(null)

	const columns = [
		{
			title: 'Diagnóstico',
			dataIndex: 'description',
		},
		{
			title: 'CIE',
			dataIndex: 'cie',
		},
		{
			title: 'Tipo',
			dataIndex: 'type',
		},
	]

	const addDiagnostic = (diagnostic) => {
		const newDiagnostics = [...diagnostics, diagnostic]
		update({ ...form.getFieldsValue(), diagnostics: newDiagnostics })
		setDiagnostics(newDiagnostics)
	}

	const editDiagnostic = (diagnostic) => {
		const newDiagnostics = [...diagnostics]
		const index = newDiagnostics.findIndex(
			(diag) => diag.rowId === diagnostic.rowId
		)
		newDiagnostics.splice(index, 1, diagnostic)
		update({ ...form.getFieldsValue(), diagnostics: newDiagnostics })
		setDiagnostics(newDiagnostics)
		setSelectedRow(diagnostic)
	}

	const deleteDiagnostic = (rowId) => {
		const newDiagnostics = diagnostics.filter(
			(diag) => diag.rowId !== rowId
		)
		update({ ...form.getFieldsValue(), diagnostics: newDiagnostics })
		setDiagnostics(newDiagnostics)
		setSelectedRow(null)
	}

	const handleAddClick = () => {
		setModalParams({
			show: true,
			data: null,
			isEdit: false,
			addDiagnostic,
		})
	}

	const handleEditClick = () => {
		if (!selectedRow) return
		setModalParams({
			show: true,
			data: selectedRow,
			isEdit: true,
			editDiagnostic,
		})
	}

	const handleDeleteClick = () => {
		if (!selectedRow) return
		deleteDiagnostic(selectedRow.rowId)
	}

	const closeModal = () => {
		setModalParams({
			show: false,
			data: null,
		})
	}

	const rowSelection = {
		onChange: (_, selectedRows) => {
			const record = selectedRows[0]
			setSelectedRow(record)
		},
	}

	const handleValuesChange = (values) => {
		update({ ...form.getFieldsValue(), diagnostics })
	}

	useEffect(() => {
		if (planDiagnostic) {
			form.setFieldsValue({
				id: planDiagnostic.id,
				planDescription: planDiagnostic.description,
				selectedPlans: planDiagnostic.details.map(
					(detail) => detail.planId
				),
			})
		}
		if (diagnosticsfromDB) {
			setDiagnostics(
				diagnosticsfromDB.map((diag, index) => ({
					rowId: index,
					description: diag.description,
					cie: diag.cie.disease,
					type: diag.type,
					cieId: diag.cie.id,
				}))
			)
		}
	}, [diagnosticsfromDB, planDiagnostic])

	return (
		<>
			<h2>Diagnósticos</h2>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					planDescription: '',
					selectedPlans: [],
					id: null,
				}}
				onValuesChange={handleValuesChange}
			>
				<Form.Item noStyle hidden name='id'>
					<Input type='hidden' />
				</Form.Item>
				<Row gutter={20}>
					<Col span={12}>
						<Form.Item
							label='Describir los antecedentes'
							name='planDescription'
						>
							<TextArea rows={4} maxLength={300} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Seleccione los antecedentes'
							name='selectedPlans'
						>
							<Checkbox.Group>
								{loadPlansCheckBoxes(plans)}
							</Checkbox.Group>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Row justify='end' style={{ marginBottom: '10px' }}>
				<Space>
					<Button type='primary' onClick={handleAddClick}>
						<FileAddOutlined />
						Agregar
					</Button>
					<Button onClick={handleEditClick}>
						<EditOutlined />
						Modificar
					</Button>
					<Button danger onClick={handleDeleteClick}>
						<DeleteOutlined />
						Eliminar
					</Button>
				</Space>
			</Row>
			<Table
				columns={columns}
				dataSource={diagnostics}
				rowKey={(record) => record.rowId}
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
			/>
			<OdoDiagnosticModal
				modalParams={modalParams}
				closeModal={closeModal}
			/>
		</>
	)
}
const mapStateToProps = (state) => {
	return {
		diagnosticsfromDB: state.odontology.data.diagnostics,
		planDiagnostic: state.odontology.data.planDiagnostic,
		plans: state.odontology.data.plans,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setPlanAndDiagnostics(value)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(OdoDiagnosticsTab)
