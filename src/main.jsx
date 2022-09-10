import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { QrModalProvider } from './contexts/QrModalContext'
import { UserProvider } from './contexts/UserContext'
import 'antd/dist/antd.css'
import './index.css'
import { LoaderProvider } from './contexts/LoaderContext'
import axios from 'axios'
import { END_POINT } from './utils/conf'
import { Provider } from 'react-redux'
import { store } from './store'
import { ConfigProvider } from 'antd'
import locale from 'antd/es/locale/es_ES'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es', {
	months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
		'_'
	),
	monthsShort:
		'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
	weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
	weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
	weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
})

axios.defaults.baseURL = END_POINT

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<ConfigProvider locale={locale}>
					<LoaderProvider>
						<UserProvider>
							<QrModalProvider>
								<App />
							</QrModalProvider>
						</UserProvider>
					</LoaderProvider>
				</ConfigProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
)
