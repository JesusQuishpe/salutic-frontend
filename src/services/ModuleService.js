import { axiosGet } from './axiosRequests'

export const ModuleService = {
	getModules: () => axiosGet('modulos'),
	getSingleModule: (id) => axiosGet(`modulos/${id}`),
	getSubmodules: (moduleId) =>
		axiosGet(`modulos?submodules=true&module_id=${moduleId}`),
}
