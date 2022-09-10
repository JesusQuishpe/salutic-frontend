import { axiosGet, axiosPost } from './axiosRequests'

export const PermissionService = {
	getPermissionsByRolandModule: (rolId, moduleId) =>
		axiosGet(`permisos?rol_id=${rolId}&module_id=${moduleId}`),
	savePermissions: (data) => axiosPost('permisos', data),
}
