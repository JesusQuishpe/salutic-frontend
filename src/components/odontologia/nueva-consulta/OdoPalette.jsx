import React from 'react'
import OdoColorItems from './OdoColorItems'
import OdoSymbologies from './OdoSymbologies'
import { Row, Col } from 'antd'
const OdoPalette = () => {
	return (
		<Row id='odo-palette' gutter={20}>
			<Col span={18}>
				<OdoSymbologies />
			</Col>
			<Col span={6}>
				<OdoColorItems />
			</Col>
		</Row>
	)
}

export default React.memo(OdoPalette)
