import { Card, Col, Descriptions } from 'antd'
import React from 'react'
import QRCode from 'react-qr-code'
import { END_POINT } from '../../utils/conf'

const PatientCard = ({ patient }) => {
	return (
		<Col span={12}>
			<Card title='Datos del paciente' bordered>
				<Descriptions title='' column={1}>
					<Descriptions.Item label='Cédula'>
						{patient.identification}
					</Descriptions.Item>
					<Descriptions.Item label='Nombres'>
						{patient.name}
					</Descriptions.Item>
					<Descriptions.Item label='Apellidos'>
						{patient.lastname}
					</Descriptions.Item>
					<Descriptions.Item label='Teléfono'>
						{patient.cellphone}
					</Descriptions.Item>
					<Descriptions.Item label='Domicilio'>
						{patient.address}
					</Descriptions.Item>
					<Descriptions.Item label='Código QR'>
						{patient.identification && (
							<a
								href={END_POINT + `pacientes/${patient.id}/qr`}
								target='_blank'
								rel='noreferrer'
							>
								<QRCode
									value={patient.identification}
									size={48}
									style={{ cursor: 'pointer' }}
								/>
							</a>
						)}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Col>
	)
}
export default React.memo(PatientCard)
