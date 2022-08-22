import React from 'react'
import { Row, Col, Typography } from 'antd'
import { setOptionSelected } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'
import '../../../css/OdoColorItem.css'
import CleanIcon from '../../../assets/svg/clean.svg'

const { Text } = Typography

const OdoColorItems = ({ optionSelected, update }) => {
	const handleItemClick = (e) => {
		e.stopPropagation()
		const type = e.target.getAttribute('data-type-selection')
		const value = e.target.getAttribute('data-value')
		update({
			type,
			data: {
				value,
			},
		})
	}

	return (
		<>
			<Text strong>Colores</Text>
			<Row style={{ marginTop: '10px', marginBottom: '10px' }} gutter={5}>
				<Col span={12}>
					<div
						data-type-selection='color'
						data-value='blue'
						className={`palette-blue ${
							optionSelected?.data?.value === 'blue'
								? 'selected'
								: null
						}`}
						onClick={handleItemClick}
					></div>
				</Col>
				<Col span={12}>
					<div
						data-type-selection='color'
						data-value='red'
						className={`palette-red ${
							optionSelected?.data?.value === 'red'
								? 'selected'
								: null
						}`}
						onClick={handleItemClick}
					></div>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<div
						data-type-selection='clean'
						data-value='clean'
						className={`clean-icon ${
							optionSelected?.type === 'clean' ? 'selected' : null
						}`}
						onClick={handleItemClick}
					>
						<img src={CleanIcon} width='24px' height='24px' />
					</div>
				</Col>
			</Row>
		</>
	)
}

const mapStateProps = (state) => {
	return {
		optionSelected: state.odontology.optionSelected,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setOptionSelected(value)),
	}
}
export default connect(mapStateProps, mapDispatchToProps)(OdoColorItems)
