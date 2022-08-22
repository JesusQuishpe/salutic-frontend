import { useContext } from 'react'
import LoaderContext from '../contexts/LoaderContext'

export const useLoader = () => {
	const { visible, tip, openLoader, closeLoader } = useContext(LoaderContext)
	return {
		visible,
		tip,
		openLoader,
		closeLoader,
	}
}
