import { Button, Row } from 'antd'
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useState,
} from 'react'

import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import DownloadIcon from '../../../assets/png/download.png'
import PDFIcon from '../../../assets/png/pdf.png'
import { updateActaChanged } from '../../../store/slices/odontology/odontologySlice'
import { APP_URL } from '../../../utils/conf'
import { DeleteOutlined } from '@ant-design/icons'

const OdoAct = ({ recId }, ref) => {
	const { data } = useSelector((state) => state.odontology)
	const [files, setFiles] = useState([])
	const [isActaChanged, setIsActaChanged] = useState(false)
	const dispatch = useDispatch()

	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		if (acceptedFiles.length > 0) {
			setIsActaChanged(true)
			//Actualiza el estado global
			dispatch(updateActaChanged(true))
		}
		setFiles(
			acceptedFiles.map((file) => {
				console.log(file)
				//console.log(file.cons)
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
				return file
			})
		)
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.png', '.jpg', '.jpeg', '.pdf'],
		},
	})

	useImperativeHandle(
		ref,
		() => ({
			acta: files[0],
		}),
		[files]
	)

	const handleDeleteClick = () => {
		if (files.length > 0) {
			setFiles([])
		}
		setIsActaChanged(true)
		//Actualiza el estado global
		dispatch(updateActaChanged(true))
	}

	return (
		<div>
			<Row style={{ marginBottom: '10px' }} justify='end'>
				<Button danger onClick={handleDeleteClick}>
					<DeleteOutlined /> Eliminar acta
				</Button>
			</Row>
			<div
				{...getRootProps()}
				className={`acta-dropzone ${isDragActive ? 'dragActive' : ''}`}
			>
				{!isActaChanged && data?.acta && (
					<div className='acta-file'>
						<div className='acta-thumb'>
							{data?.acta?.extension === 'pdf' ? (
								<img
									src={PDFIcon}
									width='70px'
									height={'70px'}
								/>
							) : (
								<img
									src={APP_URL + data?.acta?.url}
									width='70px'
									height='70px'
								/>
							)}
						</div>
						<span className='thumb-text overflow'>
							{`${data?.acta?.name}`}
						</span>
					</div>
				)}
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
