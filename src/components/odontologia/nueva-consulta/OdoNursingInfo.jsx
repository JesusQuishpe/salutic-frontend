import React from 'react'
import { connect } from 'react-redux'
import { Card, Descriptions } from 'antd'

const OdoNursingInfo = ({ data }) => {
	return (
		<Card title='Datos de enfermería' bordered>
			<Descriptions title='' column={1}>
				<Descriptions.Item label='Estatura'>
					{data?.nursingInfo?.stature + ' cm'}
				</Descriptions.Item>
				<Descriptions.Item label='Temperatura'>
					{data?.nursingInfo?.temperature + ' °C'}
				</Descriptions.Item>
				<Descriptions.Item label='Peso'>
					{data?.nursingInfo?.weight + ' kg'}
				</Descriptions.Item>
				<Descriptions.Item label='Presión'>
					{data?.nursingInfo?.pressure}
				</Descriptions.Item>
				<Descriptions.Item label='Discapacidad'>
					{data?.nursingInfo?.disability + ' %'}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		data: state.odontology.data,
	}
}

export default connect(mapStateToProps, null)(OdoNursingInfo)
