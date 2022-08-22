import React, { useEffect, useState } from 'react'
import { setTeeth } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'

function getImage(path) {
	if (!path) return null
	return new URL(`../../../assets/svg/${path}`, import.meta.url).href
}

const OdoTooth = ({ tooth, reverse, optionSelected, update }) => {
	const [toothData, setToothData] = useState({
		topSide: null,
		rightSide: null,
		bottomSide: null,
		leftSide: null,
		centerSide: null,
		symboPath: null,
		symboId: null,
		toothId: null,
		id: null,
	})

	const handleToothSideClick = (e) => {
		e.stopPropagation()
		if (!optionSelected) return
		const { type, data } = optionSelected
		if (type !== 'color') return
		const side = e.target.getAttribute('side')
		//Si son iguales quita el color
		const color = data.value !== toothData[side] ? data.value : null

		const newTooth = {
			...toothData,
			[side]: color,
		}
		setToothData(newTooth)
		update(newTooth)
	}

	const onSimboContainerClick = (e) => {
		e.stopPropagation()
		console.log(optionSelected)
		if (optionSelected.type === 'none') return
		const { type, data } = optionSelected

		if (type === 'color') return
		if (data.path === toothData?.symboPath) return
		const newTooth = {
			...toothData,
			symboId: data.id,
			symboPath: data.path,
		}

		if (type === 'clean') {
			newTooth.symboId = null
			newTooth.symboPath = null
		}

		setToothData(newTooth)
		update(newTooth)
		//showSymboImage(data.path)
	}

	const getDisplay = () => {
		if (optionSelected.type === 'color') return 'none'
		if (
			optionSelected?.type === 'symbology' ||
			optionSelected?.type === 'clean'
		)
			return 'block'
		if (toothData?.symboPath) return 'block'
		if (optionSelected.type === 'none') return 'none'
		return 'none'
	}

	useEffect(() => {
		setToothData({ ...tooth })
	}, [tooth])

	if (tooth.type === 'Vestibular') {
		return (
			<div className={`tooth-wrapper ${reverse && 'tooth-reverse'}`}>
				<p
					style={{
						margin: '0px',
					}}
				>
					{tooth.dentalPiece}
				</p>
				<div className='tooth' type='vestibular'>
					<div
						className='symbo-container hover'
						style={{
							display: getDisplay(),
						}}
						onClick={onSimboContainerClick}
					>
						{toothData?.symboPath && (
							<div className='symbo-wrapper-img'>
								<img src={getImage(toothData?.symboPath)} />
							</div>
						)}
					</div>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 102.41 102.41'
						xmlns='http://www.w3.org/2000/svg'
						fill='red'
					>
						<g id='Capa_2' data-name='Capa 2'>
							<g id='Capa_1-2' data-name='Capa 1'>
								<polygon
									side='topSide'
									className={`btn-tooth ${toothData?.topSide}`}
									onClick={handleToothSideClick}
									points='1.21 1.21 26.21 26.21 76.21 26.21 101.21 1.21 1.21 1.21'
								/>
								<polygon
									side='rightSide'
									className={`btn-tooth ${toothData?.rightSide}`}
									onClick={handleToothSideClick}
									points='101.21 1.21 76.21 26.21 76.21 76.21 101.21 101.21 101.21 1.21'
								/>
								<polygon
									side='leftSide'
									className={`btn-tooth ${toothData?.leftSide}`}
									onClick={handleToothSideClick}
									points='1.21 1.21 26.21 26.21 26.21 76.21 1.21 101.21 1.21 1.21'
								/>
								<polygon
									side='bottomSide'
									className={`btn-tooth ${toothData?.bottomSide}`}
									onClick={handleToothSideClick}
									points='1.21 101.21 26.21 76.21 76.21 76.21 101.21 101.21 1.21 101.21'
								/>
								<rect
									side='centerSide'
									className={`btn-tooth ${toothData?.centerSide}`}
									x='26.21'
									y='26.21'
									width='50'
									height='50'
									onClick={handleToothSideClick}
								/>
							</g>
						</g>
					</svg>
				</div>
			</div>
		)
	}

	return (
		<div className={`tooth-wrapper ${reverse && 'tooth-reverse'} `}>
			<p
				style={{
					margin: '0px',
				}}
			>
				{tooth.dentalPiece}
			</p>
			<div className='tooth' type='lingual'>
				<div
					className='symbo-container hover'
					style={{
						display: getDisplay(),
					}}
					onClick={onSimboContainerClick}
				>
					{toothData?.symboPath && (
						<div className='symbo-wrapper-img'>
							<img src={getImage(toothData?.symboPath)} />
						</div>
					)}
				</div>
				<svg
					width='100%'
					height='100%'
					viewBox='-0.5 -0.5 105 105'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g
						xmlns='http://www.w3.org/2000/svg'
						id='Capa_2'
						data-name='Capa 2'
					>
						<g id='Capa_1-2' data-name='Capa 1'>
							<circle
								side='centerSide'
								className={`btn-tooth ${toothData?.centerSide}`}
								cx='50.5'
								cy='50.5'
								r='25'
								onClick={handleToothSideClick}
							/>
							<line x1='68.18' y1='32.82' x2='85.86' y2='15.14' />
							<line x1='32.82' y1='32.82' x2='15.14' y2='15.14' />
							<path
								side='topSide'
								className={`btn-tooth ${toothData?.topSide}`}
								onClick={handleToothSideClick}
								d='M32.82,32.82,15.14,15.14A49.21,49.21,0,0,1,50.5.5,49.21,49.21,0,0,1,85.86,15.14L68.18,32.82A23.85,23.85,0,0,0,50.5,25.5,23.85,23.85,0,0,0,32.82,32.82Z'
							/>
							<path
								side='rightSide'
								className={`btn-tooth ${toothData?.rightSide}`}
								onClick={handleToothSideClick}
								d='M68.18,32.82,85.86,15.14A49.21,49.21,0,0,1,100.5,50.5,49.21,49.21,0,0,1,85.86,85.86L68.18,68.18A23.85,23.85,0,0,0,75.5,50.5,23.85,23.85,0,0,0,68.18,32.82Z'
							/>
							<path
								side='leftSide'
								className={`btn-tooth ${toothData?.leftSide}`}
								onClick={handleToothSideClick}
								d='M32.82,68.18,15.14,85.86A49.21,49.21,0,0,1,.5,50.5,49.21,49.21,0,0,1,15.14,15.14L32.82,32.82A23.85,23.85,0,0,0,25.5,50.5,23.85,23.85,0,0,0,32.82,68.18Z'
							/>
							<path
								side='bottomSide'
								className={`btn-tooth ${toothData?.bottomSide}`}
								onClick={handleToothSideClick}
								d='M68.18,68.18,85.86,85.86A49.21,49.21,0,0,1,50.5,100.5,49.21,49.21,0,0,1,15.14,85.86L32.82,68.18A23.85,23.85,0,0,0,50.5,75.5,23.85,23.85,0,0,0,68.18,68.18Z'
							/>
							<line x1='68.31' y1='68.31' x2='85.98' y2='85.98' />
							<line x1='32.69' y1='68.31' x2='15.02' y2='85.98' />
						</g>
					</g>
				</svg>
			</div>
		</div>
	)
}

const mapStateProps = (state) => {
	return {
		optionSelected: state.odontology.optionSelected,
		isClickOutSidePalette: state.odontology.isClickOutSidePalette,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setTeeth(value)),
	}
}

export default connect(mapStateProps, mapDispatchToProps)(OdoTooth)
