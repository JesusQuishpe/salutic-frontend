import { createContext, useState } from 'react'

const LoaderContext = createContext()

const LoaderProvider = ({ children }) => {
	const [visible, setVisible] = useState(false)
	const [tip, setTip] = useState('')

	const openLoader = (tip) => {
		setVisible(true)
		setTip(tip)
	}
	const closeLoader = () => {
		setVisible(false)
		setTip('')
	}

	const data = {
		visible,
		tip,
		openLoader,
		closeLoader,
	}
	return (
		<LoaderContext.Provider value={data}>{children}</LoaderContext.Provider>
	)
}

export default LoaderContext
export { LoaderProvider }
