import { Input, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux/es/exports'
import { updatePatientRecord } from '../../../store/slices/expedient/expedientSlice'
import { LabelWithInfo } from './PhysicalExplorationTab'

const { TabPane } = Tabs

const PatientRecordTab = ({ data, updatePatientRecord }) => {
	const [form, setForm] = useState({
		pathological: '',
		noPathological: '',
		perinatal: '',
		gynecological: '',
	})

	const updateForm = (e) => {
		const { name, value } = e.target
		setForm({ ...form, [name]: value })
		updatePatientRecord({ ...data.patientRecord, [name]: value })
	}

	useEffect(() => {
		setForm({ ...data.patientRecord })
	}, [data])

	return (
		<Tabs tabPosition='left' defaultActiveKey='pathological'>
			<TabPane tab='Patológicos' key='pathological'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='pathological'
					value={form.pathological}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='No patológicos' key='noPathological'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='noPathological'
					value={form.noPathological}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Perinatales' key='perinatal'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='perinatal'
					value={form.perinatal}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Ginecológicos' key='gynecological'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='gynecological'
					value={form.gynecological}
					onChange={updateForm}
				/>
			</TabPane>
		</Tabs>
	)
}
const mapStateToProps = (state) => {
	return {
		data: state.expedient.data,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		updatePatientRecord: (value) => dispatch(updatePatientRecord(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientRecordTab)
