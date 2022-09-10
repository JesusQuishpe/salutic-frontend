import { useContext } from 'react'
import UserContext from '../contexts/UserContext'

const useUser = () => {
	const { user, loading, isLogged, hasPermission, login, logout } =
		useContext(UserContext)
	return {
		user,
		loading,
		isLogged,
		hasPermission,
		login,
		logout,
	}
}
export default useUser
