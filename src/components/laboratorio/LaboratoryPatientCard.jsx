import { Card, Descriptions } from 'antd'
import React from 'react'

export const LaboratoryPatientCard = ({ data }) => {
	return (
		<>
			<Card title='Datos del paciente' bordered>
				<Descriptions title='' column={1}>
					<Descriptions.Item label='Cédula'>
						{data?.identification}
					</Descriptions.Item>
					<Descriptions.Item label='Nombres'>
						{data?.name}
					</Descriptions.Item>
					<Descriptions.Item label='Apellidos'>
						{data?.lastname}
					</Descriptions.Item>
					<Descriptions.Item label='Teléfono'>
						{data?.cellphone}
					</Descriptions.Item>
					<Descriptions.Item label='Domicilio'>
						{data?.address}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</>
	)
}
