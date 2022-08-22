import React, { useEffect, useState } from 'react'
import { Button, Row, Space, Table } from 'antd'
import {
	FileAddOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { setTreatments } from '../../../store/slices/odontology/odontologySlice'
import OdoTreatmentModal from './OdoTreatmentModal'
import { generateUniqueId } from '../../../utils/functions'

const OdoTreatmentsTab = ({ treatmentsFromDB, update }) => {
	const [treatments, setTreatments] = useState([])
	const [modalParams, setModalParams] = useState({})
	const [selectedRow, setSelectedRow] = useState(null)
	const [sesion, setSesion] = useState(1)

	const columns = [
		{
			title: 'Sesión',
			dataIndex: 'sesion',
		},
		{
			title: 'Complicaciones',
			dataIndex: 'complications',
		},
		{
			title: 'Procedimientos',
			dataIndex: 'procedures',
		},
	]

	const addTreatment = (treatment) => {
		const newTreatments = [...treatments, treatment]
		update(newTreatments)
		setTreatments(newTreatments)
		setSesion((prevSesion) => prevSesion + 1)
	}

	const editTreatment = (treatment) => {
		const newTreatments = [...treatments]
		const index = newTreatments.findIndex(
			(treat) => treat.rowId === treatment.rowId
		)
		newTreatments.splice(index, 1, treatment)
		update(newTreatments)
		setTreatments(newTreatments)
		setSelectedRow(treatment)
	}

	const deleteTreatment = (rowId) => {
		const mappedTreatments = treatments
			.filter((treat) => treat.rowId !== rowId)
			.map((treat, index) => ({
				...treat,
				sesion: index + 1,
			}))
		//Actualizamos el valor de la sesion
		setSesion(mappedTreatments.length + 1)
		update(mappedTreatments)
		setTreatments(mappedTreatments)
		setSelectedRow(null)
	}

	const handleAddClick = () => {
		setModalParams({
			show: true,
			data: null,
			isEdit: false,
			sesion,
			addTreatment,
		})
	}

	const handleEditClick = () => {
		console.log(treatments)
		setModalParams({
			show: true,
			data: selectedRow,
			isEdit: true,
			editTreatment,
		})
	}

	const handleDeleteClick = () => {
		console.log(selectedRow)
		if (selectedRow) {
			deleteTreatment(selectedRow.rowId)
		}
	}

	const closeModal = () => {
		setModalParams({
			show: false,
			data: null,
		})
	}

	const rowSelection = {
		onChange: (_, selectedRows) => {
			console.log(selectedRows)
			const record = selectedRows[0]
			setSelectedRow(record)
		},
	}

	useEffect(() => {
		if (treatmentsFromDB) {
			setTreatments(
				treatmentsFromDB.map((treat) => ({
					sesion: treat.sesion,
					complications: treat.complications,
					procedures: treat.procedures,
					prescriptions: treat.prescriptions,
					rowId: generateUniqueId(),
				}))
			)
			setSesion(treatmentsFromDB.length + 1)
		}
	}, [treatmentsFromDB])

	return (
		<>
			<h2>Tratamientos</h2>
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
				dataSource={treatments}
				rowKey={(record) => record.rowId}
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
			/>
			<OdoTreatmentModal
				modalParams={modalParams}
				closeModal={closeModal}
			/>
		</>
	)
}
const mapStateToProps = (state) => {
	return {
		treatmentsFromDB: state.odontology.data.treatments,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setTreatments(value)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(OdoTreatmentsTab)
