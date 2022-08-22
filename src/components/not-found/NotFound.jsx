import React from 'react'
import '../../css/NotFound.css'

const NotFound = () => {
	return (
		<div className='not-found-wrapper'>
			<div className='not-found-content'>
				<div className='not-found-text' style={{ fontSize: '150px' }}>
					404{' '}
				</div>
				<div className='not-found-text' style={{ fontSize: '40px' }}>
					Sorry, the page not found
				</div>
			</div>
		</div>
	)
}

export { NotFound }
