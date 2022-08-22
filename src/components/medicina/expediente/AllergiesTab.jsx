import { Card, Input, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { updateAllergies } from '../../../store/slices/expedient/expedientSlice'

const { Text } = Typography

const AllergiesTab = ({ allergies, update }) => {
	const updateForm = (e) => {
		const { name, value } = e.target
		update({ ...allergies, [name]: value })
	}

	return (
		<Card title='Alergias'>
			<Text type='secondary'>
				Deje en blanco si el paciente no tiene ninguna alergia
			</Text>
			<Input.TextArea
				rows={10}
				name='description'
				value={allergies.description}
				onChange={updateForm}
			/>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		allergies: state.expedient.allergies,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updateAllergies(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AllergiesTab)
