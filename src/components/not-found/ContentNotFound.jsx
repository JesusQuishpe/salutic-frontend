import React from 'react'
import '../../css/NotFoundContent.css'

const ContentNotFound = () => {
	return (
		<div className='wrapper-404'>
			<div className='content-404'>
				<div className='text-404' style={{ fontSize: '150px' }}>
					404{' '}
				</div>
				<div className='text-404' style={{ fontSize: '40px' }}>
					Sorry, the page not found
				</div>
			</div>
		</div>
	)
}

export { ContentNotFound }
