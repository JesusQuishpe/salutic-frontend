import { Tabs } from 'antd'
import React from 'react'
import AditionalInformation from './AditionalInformation'
import PersonalInformation from './PersonalInformation'

const { TabPane } = Tabs
const PersonalInformationTab = () => {
	return (
		<Tabs tabPosition='left' defaultActiveKey='infoPer'>
			<TabPane tab='Información personal' key='infoPer'>
				<PersonalInformation />
			</TabPane>
			<TabPane tab='Información adicional' key='infoAdi'>
				<AditionalInformation />
			</TabPane>
		</Tabs>
	)
}
export default React.memo(PersonalInformationTab)
