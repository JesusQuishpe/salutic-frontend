import { Modal } from 'antd'
import { useContext } from 'react'
import { QrReader } from 'react-qr-reader'
import QrModalContext from '../../contexts/QrModalContext'

export const QRModal = ({ handleSearch }) => {
	const { visible, closeModal } = useContext(QrModalContext)

	const handleScan = (data) => {
		if (data) {
			handleSearch(data)
		}
	}

	return (
		<Modal
			title='Escanear QR'
			visible={visible}
			onCancel={closeModal}
			cancelText='Cancelar'
			okButtonProps={{
				disabled: true,
			}}
		>
			<QrReader delay={300} onResult={handleScan} />
		</Modal>
	)
}
