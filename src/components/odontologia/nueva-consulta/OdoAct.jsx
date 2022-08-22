import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useImperativeHandle } from 'react'
import { useDropzone } from 'react-dropzone'
import DownloadIcon from '../../../assets/png/download.png'
import PDFIcon from '../../../assets/png/pdf.png'

const OdoAct = (props, ref) => {
	const [files, setFiles] = useState([])

	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		setFiles(
			acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			)
		)
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: '.png,.jpg,.jpeg,.pdf',
	})

	useImperativeHandle(
		ref,
		() => ({
			actaFile: files[0],
		}),
		[files]
	)

	return (
		<div>
			<div
				{...getRootProps()}
				className={`acta-dropzone ${isDragActive ? 'dragActive' : ''}`}
			>
				{files.length === 1 ? (
					<div className='acta-file'>
						<div className='acta-thumb'>
							{files[0].type === 'application/pdf' ? (
								<img
									src={PDFIcon}
									width='70px'
									height={'70px'}
								/>
							) : (
								<img
									src={files[0].preview}
									width='90px'
									height={'90px'}
								/>
							)}
						</div>
						<span className='thumb-text overflow'>
							{files[0].path}
						</span>
					</div>
				) : (
					''
				)}
				<input {...getInputProps()} />
				<div className='acta-info'>
					<img src={DownloadIcon} />
					<p className='acta-input mb-1'>
						Soltar acta en pdf, jpg o png aquí o click para buscar
					</p>
				</div>
			</div>
		</div>
	)
}

export default forwardRef(OdoAct)
