import { Alert } from 'antd'
import React, { useCallback, useEffect } from 'react'
import OdoMovilitiesRecessions from './OdoMovilitiesRecessions'
import OdoQuadrant from './OdoQuadrant'
import OdoPalette from './OdoPalette'
import { useDispatch, useSelector } from 'react-redux'
import { setOptionSelected } from '../../../store/slices/odontology/odontologySlice'

const OdoOdontogramTab = (props, ref) => {
	const dispatch = useDispatch()
	const { optionSelected } = useSelector((state) => state.odontology)

	const handleClickOutside = useCallback(
		(e) => {
			const $paletteContainer = document.getElementById('odo-palette')
			if (
				!$paletteContainer.contains(e.target) &&
				optionSelected.type !== 'none'
			) {
				dispatch(setOptionSelected({ type: 'none' }))
			}
		},
		[optionSelected]
	)

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [handleClickOutside])

	return (
		<>
			<Alert
				message='Pintar con: azul para tratamiento realizado - rojo para
				patología actual Movilidad y recesión: Marcar "X" (1,2 ó
				3), Si aplica.'
				style={{
					marginBottom: '10px',
				}}
			/>
			<div id='odontogram' className='odontogram-grid' ref={ref}>
				<div style={{ height: '30px' }}>Recesión</div>
				<OdoMovilitiesRecessions start={0} end={8} type={'recesion'} />
				<OdoMovilitiesRecessions start={8} end={16} type={'recesion'} />
				<div>Movilidad</div>
				<OdoMovilitiesRecessions
					start={16}
					end={24}
					type={'movilidad'}
				/>
				<OdoMovilitiesRecessions
					start={24}
					end={32}
					type={'movilidad'}
				/>
				<div style={{ alignSelf: 'center' }}>Vestibular</div>
				<OdoQuadrant
					key={1}
					quadrant={1}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 1 && t.type === "Vestibular") : []}
					type={'Vestibular'}
					reverse={false}
				/>
				<OdoQuadrant
					key={2}
					quadrant={2}
					type={'Vestibular'}
					reverse={false}
				/>
				<div
					style={{
						alignSelf: 'center',
						gridRowStart: 4,
						gridRowEnd: 'span 2',
					}}
				>
					Lingual
				</div>
				<OdoQuadrant
					key={3}
					quadrant={5}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 5 && t.type === "Lingual") : []}
					type={'Lingual'}
					reverse={false}
				/>
				<OdoQuadrant
					key={4}
					quadrant={6}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 6 && t.type === "Lingual") : []}
					type={'Lingual'}
					reverse={false}
				/>

				<OdoQuadrant
					key={5}
					quadrant={8}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 8 && t.type === "Lingual") : []}
					type={'Lingual'}
					reverse={true}
				/>
				<OdoQuadrant
					key={6}
					quadrant={7}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 7 && t.type === "Lingual") : []}
					type={'Lingual'}
					reverse={true}
				/>
				<div style={{ alignSelf: 'center' }}>Vestibular</div>
				<OdoQuadrant
					key={7}
					quadrant={4}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 4 && t.type === "Vestibular") : []}
					type={'Vestibular'}
					reverse={true}
				/>
				<OdoQuadrant
					key={8}
					quadrant={3}
					//teeth={teeth ? teeth.filter((t) => t.quadrant === 3 && t.type === "Vestibular") : []}
					type={'Vestibular'}
					reverse={true}
				/>
				<div>Recesión</div>
				<OdoMovilitiesRecessions
					start={32}
					end={40}
					type={'recesion'}
				/>
				<OdoMovilitiesRecessions
					start={40}
					end={48}
					type={'recesion'}
				/>
				<div>Movilidad</div>
				<OdoMovilitiesRecessions
					start={48}
					end={56}
					type={'movilidad'}
				/>
				<OdoMovilitiesRecessions
					start={56}
					end={64}
					type={'movilidad'}
				/>
			</div>
			<OdoPalette />
		</>
	)
}
export default React.forwardRef(OdoOdontogramTab)
