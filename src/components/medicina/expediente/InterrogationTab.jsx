import { Input, Tabs } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { updateInterrogation } from '../../../store/slices/expedient/expedientSlice'

const { TabPane } = Tabs

const InterrogationTab = ({ interrogation, update }) => {
	const updateForm = (e) => {
		const { name, value } = e.target
		update({ ...interrogation, [name]: value })
	}

	return (
		<Tabs tabPosition='left' defaultActiveKey='cardiovascular'>
			<TabPane tab='Cardiovascular' key='cardiovascular'>
				<Input.TextArea
					rows={30}
					name='cardiovascular'
					value={interrogation.cardiovascular}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Digestivo' key='digestive'>
				<Input.TextArea
					rows={30}
					name='digestive'
					value={interrogation.digestive}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Endocrino' key='endocrine'>
				<Input.TextArea
					rows={30}
					name='endocrine'
					value={interrogation.endocrine}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Hemolinfatico' key='hemolymphatic'>
				<Input.TextArea
					rows={30}
					name='hemolymphatic'
					value={interrogation.hemolymphatic}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Mamas' key='mamas'>
				<Input.TextArea
					rows={30}
					name='mamas'
					value={interrogation.mamas}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Músculo-Esqulético' key='skeletalMuscle'>
				<Input.TextArea
					rows={30}
					name='skeletalMuscle'
					value={interrogation.skeletalMuscle}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Piel y Anexos' key='skinAndAnnexes'>
				<Input.TextArea
					rows={30}
					name='skinAndAnnexes'
					value={interrogation.skinAndAnnexes}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Reproductor' key='reproductive'>
				<Input.TextArea
					rows={30}
					name='reproductive'
					value={interrogation.reproductive}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Respiratorio' key='respiratory'>
				<Input.TextArea
					rows={30}
					name='respiratory'
					value={interrogation.respiratory}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Sistema nervioso' key='nervousSystem'>
				<Input.TextArea
					rows={30}
					name='nervousSystem'
					value={interrogation.nervousSystem}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Sistemas Generales' key='generalSystems'>
				<Input.TextArea
					rows={30}
					name='generalSystems'
					value={interrogation.generalSystems}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Urinario' key='urinary'>
				<Input.TextArea
					rows={30}
					name='urinary'
					value={interrogation.urinary}
					onChange={updateForm}
				/>
			</TabPane>
		</Tabs>
	)
}
const mapStateToProps = (state) => {
	return {
		interrogation: state.expedient.interrogation,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updateInterrogation(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterrogationTab)
