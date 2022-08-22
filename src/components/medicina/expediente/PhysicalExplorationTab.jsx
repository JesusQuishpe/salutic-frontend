import { Input, Tabs } from 'antd'
import React from 'react'
import { updatePhysicalExploration } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
const { TabPane } = Tabs

const PhysicalExplorationTab = ({ physicalExploration, update }) => {
	const updateForm = (e) => {
		const { name, value } = e.target
		update({ ...physicalExploration, [name]: value })
	}

	return (
		<Tabs tabPosition='left' defaultActiveKey='patologicos'>
			<TabPane tab='Habitus exterior' key='outerHabitus'>
				<Input.TextArea
					rows={30}
					name='outerHabitus'
					value={physicalExploration.outerHabitus}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Cabeza' key='head'>
				<Input.TextArea
					rows={30}
					name='head'
					value={physicalExploration.head}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Ojos' key='eyes'>
				<Input.TextArea
					rows={30}
					name='eyes'
					value={physicalExploration.eyes}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Otorrinolaringología' key='otorhinolaryngology'>
				<Input.TextArea
					rows={30}
					name='otorhinolaryngology'
					value={physicalExploration.otorhinolaryngology}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Cuello' key='neck'>
				<Input.TextArea
					rows={30}
					name='neck'
					value={physicalExploration.neck}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Torax' key='chest'>
				<Input.TextArea
					rows={30}
					name='chest'
					value={physicalExploration.chest}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Abdomen' key='abdomen'>
				<Input.TextArea
					rows={30}
					name='abdomen'
					value={physicalExploration.abdomen}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane
				tab='Exploracion ginecológica'
				key='gynecologicalExamination'
			>
				<Input.TextArea
					rows={30}
					name='gynecologicalExamination'
					value={physicalExploration.gynecologicalExamination}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Genitales' key='genitals'>
				<Input.TextArea
					rows={30}
					name='genitals'
					value={physicalExploration.genitals}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Columna vertebral' key='spine'>
				<Input.TextArea
					rows={30}
					name='spine'
					value={physicalExploration.spine}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Extremidades' key='extremities'>
				<Input.TextArea
					rows={30}
					name='extremities'
					value={physicalExploration.extremities}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane
				tab='Exploración neurológica'
				key='neurologicalExamination'
			>
				<Input.TextArea
					rows={30}
					name='neurologicalExamination'
					value={physicalExploration.neurologicalExamination}
					onChange={updateForm}
				/>
			</TabPane>
		</Tabs>
	)
}
const mapStateToProps = (state) => {
	return {
		physicalExploration: state.expedient.physicalExploration,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updatePhysicalExploration(value)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PhysicalExplorationTab)
