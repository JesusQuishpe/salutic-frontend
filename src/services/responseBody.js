import { camelizeKeys } from '../utils/functions'

export const responseBody = (response) => camelizeKeys(response.data)
