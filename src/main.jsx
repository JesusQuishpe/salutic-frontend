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

axios.defaults.baseURL = END_POINT

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<LoaderProvider>
					<UserProvider>
						<QrModalProvider>
							<App />
						</QrModalProvider>
					</UserProvider>
				</LoaderProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
)
