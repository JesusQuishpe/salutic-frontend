import React from 'react'
import OdoTooth from './OdoTooth'
import { connect } from 'react-redux'

const OdoQuadrant = ({ data, quadrant, type, reverse }) => {
	const teethOfQuadrant = data?.teeth
		? data.teeth.filter((t) => t.quadrant === quadrant && t.type === type)
		: []

	return (
		<div id={`cuadrante-${quadrant}`} className='cuadrante'>
			{teethOfQuadrant.map((tooth, index) => {
				//Esto son los dientes que vienen del odontograma de la base de datos
				const toothFinded = data?.odontogram?.teeth?.find(
					(toothDetail) => toothDetail.toothId === tooth.id
				)
				const toothData = {
					id: toothFinded?.id || null, //id detail
					toothId: tooth.id,
					type: tooth.type,
					dentalPiece: tooth.dentalPiece,
					teethNum: tooth.teethNum,
					topSide: toothFinded?.topSide || null,
					rightSide: toothFinded?.rightSide || null,
					leftSide: toothFinded?.leftSide || null,
					bottomSide: toothFinded?.bottomSide || null,
					centerSide: toothFinded?.centerSide || null,
					symboPath: toothFinded?.symbologie?.path || null,
					symboId: toothFinded?.symboId || null,
				}
				if ((quadrant === 5 || quadrant === 8) && index === 0) {
					return (
						<div style={{ gridColumnStart: 4 }} key={tooth.id}>
							<OdoTooth
								key={tooth.id}
								tooth={toothData}
								reverse={reverse}
							/>
						</div>
					)
				}
				return (
					<OdoTooth
						key={tooth.id}
						tooth={toothData}
						reverse={reverse}
					/>
				)
			})}
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		data: state.odontology.data,
	}
}

/*const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setFamilyHistory(value)),
	}
}*/

export default connect(mapStateToProps, null)(OdoQuadrant)
