import { useContext } from 'react'
import UserContext from '../contexts/UserContext'

const useUser = () => {
	const { user, loading, isLogged, login, logout } = useContext(UserContext)
	return {
		user,
		loading,
		isLogged,
		login,
		logout,
	}
}
export default useUser
