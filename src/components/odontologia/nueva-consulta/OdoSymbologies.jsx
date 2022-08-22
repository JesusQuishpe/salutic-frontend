import React from 'react'
import { connect } from 'react-redux'
import SymbologyItem from './SymbologyItem'
import { Typography } from 'antd'

const { Text } = Typography

const OdoSymbologies = ({ data, optionSelected }) => {
	return (
		<div className='symbologies'>
			<Text strong>Simbologías</Text>
			<div className='symbologies-grid'>
				{data?.symbologies
					? data.symbologies.map((symb) => {
							return (
								<SymbologyItem
									key={symb.id}
									id={symb.id}
									name={symb.name}
									path={symb.path}
									isSelected={
										optionSelected?.data?.name === symb.name
									}
								/>
							)
					  })
					: ''}
			</div>
		</div>
	)
}
const mapStateProps = (state) => {
	return {
		data: state.odontology.data,
		optionSelected: state.odontology.optionSelected,
	}
}

export default connect(mapStateProps, null)(OdoSymbologies)
