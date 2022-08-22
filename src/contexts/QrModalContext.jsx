import { createContext, useState } from 'react'

const QrModalContext = createContext()

const QrModalProvider = ({ children }) => {
	const [visible, setVisible] = useState(false)

	const openModal = () => {
		setVisible(true)
	}

	const closeModal = () => {
		setVisible(false)
	}

	const data = {
		visible,
		openModal,
		closeModal,
	}

	return (
		<QrModalContext.Provider value={data}>
			{children}
		</QrModalContext.Provider>
	)
}
export default QrModalContext
export { QrModalProvider }
