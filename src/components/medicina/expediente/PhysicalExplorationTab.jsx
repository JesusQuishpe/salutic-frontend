import { Col, Input, Popover, Row, Tabs } from 'antd'
import React from 'react'
import { updatePhysicalExploration } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import {
	infoChest,
	infoExtremities,
	infoGenitals,
	infoGynecological,
	infoHabitusExterior,
	infoHead,
	infoNeck,
	infoNeurologicalExploration,
	infoSpine,
} from './PhysicalExplorationInfo'
const { TabPane } = Tabs

export const LabelWithInfo = ({ label, popoverContent, showIcon = true }) => {
	return (
		<Row style={{ paddingBottom: '8px' }} align='middle' gutter={5}>
			<Col span={'auto'}>{label} </Col>
			<Col flex={'none'}>
				{showIcon && (
					<Popover
						title='Información'
						content={popoverContent}
						placement='right'
					>
						<InfoCircleOutlined />
					</Popover>
				)}
			</Col>
		</Row>
	)
}

const PhysicalExplorationTab = ({ physicalExploration, update }) => {
	const updateForm = (e) => {
		const { name, value } = e.target
		update({ ...physicalExploration, [name]: value })
	}

	return (
		<Tabs tabPosition='left' defaultActiveKey='patologicos'>
			<TabPane tab='Habitus exterior' key='outerHabitus'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={infoHabitusExterior}
				/>
				<Input.TextArea
					rows={30}
					name='outerHabitus'
					value={physicalExploration.outerHabitus}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Cabeza' key='head'>
				<LabelWithInfo label='Descripción' popoverContent={infoHead} />
				<Input.TextArea
					rows={30}
					name='head'
					value={physicalExploration.head}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Ojos' key='eyes'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='eyes'
					value={physicalExploration.eyes}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Otorrinolaringología' key='otorhinolaryngology'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
				<Input.TextArea
					rows={30}
					name='otorhinolaryngology'
					value={physicalExploration.otorhinolaryngology}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Cuello' key='neck'>
				<LabelWithInfo label='Descripción' popoverContent={infoNeck} />
				<Input.TextArea
					rows={30}
					name='neck'
					value={physicalExploration.neck}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Torax' key='chest'>
				<LabelWithInfo label='Descripción' popoverContent={infoChest} />
				<Input.TextArea
					rows={30}
					name='chest'
					value={physicalExploration.chest}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Abdomen' key='abdomen'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={null}
					showIcon={false}
				/>
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
				<LabelWithInfo
					label='Descripción'
					popoverContent={infoGynecological}
				/>
				<Input.TextArea
					rows={30}
					name='gynecologicalExamination'
					value={physicalExploration.gynecologicalExamination}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Genitales' key='genitals'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={infoGenitals}
				/>
				<Input.TextArea
					rows={30}
					name='genitals'
					value={physicalExploration.genitals}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Columna vertebral' key='spine'>
				<LabelWithInfo label='Descripción' popoverContent={infoSpine} />
				<Input.TextArea
					rows={30}
					name='spine'
					value={physicalExploration.spine}
					onChange={updateForm}
				/>
			</TabPane>
			<TabPane tab='Extremidades' key='extremities'>
				<LabelWithInfo
					label='Descripción'
					popoverContent={infoExtremities}
				/>
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
				<LabelWithInfo
					label='Descripción'
					popoverContent={infoNeurologicalExploration}
				/>
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
