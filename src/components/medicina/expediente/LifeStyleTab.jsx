import { Col, Row } from 'antd'
import React from 'react'
import FeedingHabits from './FeedingHabits'
import Others from './Others'
import PhysicalActivity from './PhysicalActivityComp'
import Smoking from './Smoking'

const LifeStyleTab = () => {
	return (
		<>
			<Row gutter={20} style={{ marginBottom: '20px' }}>
				<Col span={12}>
					<PhysicalActivity />
				</Col>
				<Col span={12}>
					<Smoking />
				</Col>
			</Row>
			<Row gutter={20} style={{ marginBottom: '20px' }}>
				<Col span={12}>
					<FeedingHabits />
				</Col>
				<Col span={12}>
					<Others />
				</Col>
			</Row>
			{/*<Row gutter={20} style={{ marginBottom: '20px' }}>
				<Col span={24}>
					<Drogas update={setConsumoDeDrogas} />
				</Col>
  </Row>*/}
		</>
	)
}
export default React.memo(LifeStyleTab)
