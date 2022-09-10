import { Button, Checkbox, Row, Space, Table } from 'antd'
import {
	FileAddOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { createDateFromString, parseDate } from '../../../utils/functions'
import ModalCie from './ModalCie'

const initialParamsModal = {
	data: null,
	visible: false,
	isEdit: false,
}

const MedCies = ({ isEdit, data, update }) => {
	const [cies, setCies] = useState([])

	const [paramsModal, setParamsModal] = useState(initialParamsModal)

	const [rowSelected, setRowSelected] = useState(null)

	const columns = [
		{
			title: 'Código',
			dataIndex: 'code',
		},
		{
			title: 'Enfermedad',
			dataIndex: 'disease',
		},
		{
			title: 'Severidad',
			dataIndex: 'severity',
		},
		{
			title: 'Activa?',
			dataIndex: 'activeDisease',
			render: (_, record) => {
				return <Checkbox checked={record.activeDisease} />
			},
		},
		{
			title: 'Fecha diagnostico',
			dataIndex: 'date',
			render: (_, record) => {
				return parseDate(record.diagnosticDate, 'DD/MM/YYYY')
			},
		},
	]

	const addCie = (cie) => {
		const newCies = [...cies, cie]
		setCies(newCies)
		update(newCies)
	}

	const updateCie = (cieParam, code) => {
		const newCies = cies.slice()
		const cieCopy = { ...cieParam }
		const index = cies.findIndex((cie) => cie.code === code)
		if (index >= 0) {
			newCies.splice(index, 1, cieCopy)
		} else {
			newCies.splice(index, 1)
			newCies.push(cieCopy)
		}
		setCies(newCies)
		setRowSelected(cieCopy)
		update(newCies)
	}

	const deleteCie = () => {
		if (!rowSelected) return
		const newCies = cies.filter((cie) => cie.code !== rowSelected.code)
		setCies(newCies)
		setRowSelected(null)
		update(newCies)
	}

	const crudOperations = {
		onAdd: addCie,
		onUpdate: updateCie,
		onDelete: deleteCie,
	}

	const openModal = (data, isEdit) => {
		if (isEdit) {
			if (!rowSelected) return
		}
		setParamsModal({ visible: true, isEdit, data })
	}

	const closeModal = () => {
		setParamsModal({ ...initialParamsModal })
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const cie = selectedRows[0]
			console.log(cie)
			setRowSelected(cie)
		},
	}

	const handleEditAction = () => {
		openModal({ ...rowSelected }, true)
	}

	const handleAddAction = () => {
		openModal(null, false)
	}

	useEffect(() => {
		if (data) {
			console.log('CIES:', data)
			setCies(
				data.map((item) => ({
					...item,
					id: item.id,
					code: item.cie.code,
					disease: item.cie.disease,
					diagnosticDate: createDateFromString(item.diagnosticDate),
					cured: createDateFromString(item.cured),
				}))
			)
		}
	}, [data])

	return (
		<div>
			<Row justify='end' style={{ marginBottom: '10px' }}>
				<Space>
					<Button type='primary' onClick={handleAddAction}>
						<FileAddOutlined />
						Agregar
					</Button>
					<Button onClick={handleEditAction}>
						<EditOutlined />
						Modificar
					</Button>
					<Button danger onClick={deleteCie}>
						<DeleteOutlined />
						Eliminar
					</Button>
				</Space>
			</Row>
			<Table
				columns={columns}
				rowKey={(record) => record.code}
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
				dataSource={cies}
			/>
			<ModalCie
				params={paramsModal}
				closeModal={closeModal}
				crudOperations={crudOperations}
			/>
		</div>
	)
}
export default React.memo(MedCies)
