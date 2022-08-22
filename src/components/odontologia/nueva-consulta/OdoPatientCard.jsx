import React from 'react'
import { connect } from 'react-redux'
import { Card, Descriptions } from 'antd'

const OdoPatientCard = ({ data }) => {
	return (
		<>
			<Card title='Datos del paciente' bordered>
				<Descriptions title='' column={1}>
					<Descriptions.Item label='Cédula'>
						{data?.patient?.identification || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Nombres'>
						{data?.patient?.name || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Apellidos'>
						{data?.patient?.lastname || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Teléfono'>
						{data?.patient?.cellphone || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Domicilio'>
						{data?.patient?.address || ''}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</>
	)
}
const mapStateToProps = (state) => {
	return {
		data: state.odontology.data,
	}
}

export default connect(mapStateToProps, null)(OdoPatientCard)
