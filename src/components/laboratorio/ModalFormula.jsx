import { Button, Col, Divider, Input, Modal, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useFetchTests } from '../../hooks/useFetchTests'
import { Calculator } from './Calculator'
import { PlusCircleOutlined } from '@ant-design/icons'

export const ModalFormula = ({
	show,
	testFormula,
	closeModal,
	updateFormulaInForm,
}) => {
	const { tests, loading } = useFetchTests()
	const [formula, setFormula] = useState('')
	const [filterText, setFilterText] = useState('')
	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: 'Code',
			dataIndex: 'code',
		},
		{
			title: 'Nombre',
			dataIndex: 'name',
		},
		{
			title: 'Precio',
			dataIndex: 'price',
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Button
						type='primary'
						onClick={() => setFormula((prev) => prev + record.code)}
					>
						<PlusCircleOutlined />
					</Button>
				)
			},
		},
	]

	const handleFormulaChange = (option) => {
		if (option === 'Limpiar') {
			setFormula('')
		} else {
			setFormula(formula + option)
		}
	}

	/**
	 * Guarda la formula y cierra el modal
	 * @param {Event} e
	 */
	const handleOk = () => {
		updateFormulaInForm(formula)
		closeModal()
	}

	useEffect(() => {
		setFormula(testFormula)
	}, [testFormula])

	return (
		<Modal
			title='Pruebas'
			okText='Guardar'
			cancelText='Cancelar'
			visible={show}
			onCancel={closeModal}
			onOk={handleOk}
			width={1000}
		>
			<Row style={{ marginBottom: '10px' }}>
				<Col span={24}>Fórmula</Col>
				<Col span={24}>
					<Input value={formula} disabled />
				</Col>
			</Row>
			<Divider />
			<Row gutter={10}>
				<Col span={16}>
					<h3>Pruebas de laboratorio</h3>
					<Input.Search
						placeholder='Buscar prueba por nombre'
						style={{ marginBottom: '5px' }}
						onSearch={(value) => setFilterText(value)}
					/>
					<Table
						columns={columns}
						dataSource={tests.filter((test) =>
							test.name
								.toLowerCase()
								.includes(filterText.toLowerCase())
						)}
						rowKey={(record) => record.id}
						loading={loading}
					/>
				</Col>
				<Col span={8}>
					<Calculator onChangeFormula={handleFormulaChange} />
				</Col>
			</Row>
		</Modal>
	)
}
