import React, { useEffect, useState } from 'react'
import OdoInputMR from './OdoInputMR'
import { connect } from 'react-redux'
import '../../../css/MovilitiesRecessions.css'

const createMovilitiesRecessions = (start, end, type, details = []) => {
	const cols = []
	for (let index = start; index < end; index++) {
		const detail = details.find((detail) => detail.pos === index)
		cols.push(
			<OdoInputMR
				key={index}
				pos={index}
				type={type}
				valueOfDetail={detail ? detail.value : ''}
				id={detail ? detail.id : null}
			/>
		)
	}

	return cols
}

const OdoMovilitiesRecessions = ({ data, start, end, type }) => {
	const [cols, setCols] = useState([])

	useEffect(() => {
		createMovilitiesRecessions(start, end, type, [])
	}, [])

	useEffect(() => {
		if (data) {
			setCols(
				createMovilitiesRecessions(
					start,
					end,
					type,
					data?.odontogram?.movilitiesRecessions
				)
			)
		}
	}, [data])

	return <div className='cuadrante'>{cols}</div>
}

const mapStateToProps = (state) => {
	return {
		data: state.odontology.data,
	}
}

export default connect(mapStateToProps, null)(OdoMovilitiesRecessions)
