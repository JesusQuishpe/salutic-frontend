import { Route, Routes, Outlet } from 'react-router-dom'
import { Citations } from './components/caja/Citations'
import { NewCitation } from './components/caja/NewCitation'
import { PatientForm } from './components/caja/PatientForm'
import { Patients } from './components/caja/Patients'
import { ConstultHistory } from './components/enfermeria/ConstultHistory'
import { PatientQueue } from './components/enfermeria/PatientQueue'
import { Home } from './components/home/Home'
import { AreaForm } from './components/laboratorio/AreaForm'
import { Areas } from './components/laboratorio/Areas'
import { ConsultHistoryResults } from './components/laboratorio/ConsultHistoryResults'
import { EditLaboratoryResults } from './components/laboratorio/EditLaboratoryResults'
import { GroupForm } from './components/laboratorio/GroupForm'
import { Groups } from './components/laboratorio/Groups'
import { LaboratoryTakeResults } from './components/laboratorio/LaboratoryTakeResults'
import { MeasurementUnitForm } from './components/laboratorio/MeasurementUnitForm'
import { MeasurementUnits } from './components/laboratorio/MeasurementUnits'
import { TestForm } from './components/laboratorio/TestForm'
import { Tests } from './components/laboratorio/Tests'
import { Login } from './components/login/Login'
import { Cies } from './components/mantenimiento/Cies'
import { CompanyForm } from './components/mantenimiento/CompanyForm'
import { Medicines } from './components/mantenimiento/Medicines'
import { Permissions } from './components/mantenimiento/Permissions'
import { Roles } from './components/mantenimiento/Roles'
import { RolForm } from './components/mantenimiento/RolForm'
import { UserForm } from './components/mantenimiento/UserForm'
import { Users } from './components/mantenimiento/Users'
import { Expedient } from './components/medicina/expediente/Expedient'
import { MedPatientQueue } from './components/medicina/MedPatientQueue'
import { NewConsultation } from './components/medicina/nueva-consulta/NewConsultation'
import { SearchExpedient } from './components/medicina/SearchExpedient'
import { NotFound } from './components/not-found/NotFound'
import { OdoNewConsultation } from './components/odontologia/nueva-consulta/OdoNewConsultation'
import { OdoConsultHistory } from './components/odontologia/OdoConsultHistory'
import { OdoPatientQueue } from './components/odontologia/OdoPatientQueue'
import useUser from './hooks/useUser'

function App() {
	const { isLogged } = useUser()
	console.log(isLogged)
	if (!isLogged) {
		return <Login />
	}

	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Home />}>
					<Route path='/login' element={<Login />} />
					<Route path='caja/citas' element={<Outlet />}>
						<Route index element={<Citations />} />
						<Route path='nuevo' element={<NewCitation />} />
					</Route>
					<Route path='caja/pacientes' element={<Outlet />}>
						<Route index element={<Patients />} />
						<Route path='nuevo' element={<PatientForm />} />
						<Route
							path=':patientId/editar'
							element={<PatientForm />}
						/>
					</Route>
					<Route path='enfermeria/citas' element={<PatientQueue />} />
					<Route
						path='enfermeria/historial'
						element={<ConstultHistory />}
					/>

					<Route path='medicina/citas' element={<Outlet />}>
						<Route index element={<MedPatientQueue />} />
						<Route
							path=':appoId/nuevo'
							element={<NewConsultation />}
						/>
						<Route
							path=':consultationId/editar'
							element={<NewConsultation />}
						/>
					</Route>
					<Route path='medicina/expedientes' element={<Outlet />}>
						<Route index element={<SearchExpedient />} />
						<Route
							path=':expedientId/editar'
							element={<Expedient />}
						/>
					</Route>
					<Route path='odontologia/citas' element={<Outlet />}>
						<Route index element={<OdoPatientQueue />} />
						<Route
							path=':appoId/nuevo'
							element={<OdoNewConsultation />}
						/>
						<Route
							path=':recId/editar'
							element={<OdoNewConsultation />}
						/>
					</Route>
					<Route
						path='odontologia/historial'
						element={<OdoConsultHistory />}
					/>
					<Route path='areas' element={<Outlet />}>
						<Route index element={<Areas />} />
						<Route path='nuevo' element={<AreaForm />} />
						<Route path=':areaId/editar' element={<AreaForm />} />
					</Route>
					<Route path='unidades' element={<Outlet />}>
						<Route index element={<MeasurementUnits />} />
						<Route path='nuevo' element={<MeasurementUnitForm />} />
						<Route
							path=':unitId/editar'
							element={<MeasurementUnitForm />}
						/>
					</Route>
					<Route path='grupos' element={<Outlet />}>
						<Route index element={<Groups />} />
						<Route path='nuevo' element={<GroupForm />} />
						<Route path=':groupId/editar' element={<GroupForm />} />
					</Route>
					<Route path='pruebas' element={<Outlet />}>
						<Route index element={<Tests />} />
						<Route path='nuevo' element={<TestForm />} />
						<Route path=':testId/editar' element={<TestForm />} />
					</Route>
					<Route path='roles' element={<Outlet />}>
						<Route index element={<Roles />} />
						<Route path='nuevo' element={<RolForm />} />
						<Route path=':rolId/editar' element={<RolForm />} />
					</Route>
					<Route path='usuarios' element={<Outlet />}>
						<Route index element={<Users />} />
						<Route path='nuevo' element={<UserForm />} />
						<Route path=':userId/editar' element={<UserForm />} />
					</Route>
					<Route path='empresa' element={<CompanyForm />} />
					<Route path='captura' element={<LaboratoryTakeResults />} />
					<Route path='resultados' element={<Outlet />}>
						<Route index element={<ConsultHistoryResults />} />
						<Route
							path=':resultId/editar'
							element={<EditLaboratoryResults />}
						/>
					</Route>
					<Route path='permisos' element={<Permissions />} />
					<Route path='medicamentos' element={<Medicines />} />
					<Route path='cies' element={<Cies />} />
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</div>
	)
}

export default App
