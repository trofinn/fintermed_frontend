
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.jsx";
import {DeveloperRegistrationForm} from "@/layouts/developer-register-page.jsx";
import {DeveloperLoginPage} from "@/layouts/developer-login-page.jsx";
import {ProtectedRoute} from "@/layouts/protected-route.jsx";
import {DeveloperDashboard} from "@/layouts/developer-dashboard/developer-dashboard.jsx";
import {ProjectUnitiesDashboard} from "@/layouts/project-dashboard/project-unities-dashboard.jsx";
import {ClientRegistrationForm} from "@/layouts/client-register-page.jsx";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<DeveloperRegistrationForm/>}/>
                    <Route path="/login" element={<DeveloperLoginPage/>}/>
                    <Route path="/dashboard" element={(<ProtectedRoute><DeveloperDashboard/></ProtectedRoute>)}/>
                    <Route path="/projects/:projectId" element={(<ProtectedRoute><ProjectUnitiesDashboard/></ProtectedRoute>)}/>
                    <Route path="/client-register" element={<ClientRegistrationForm />} />
                </Routes>
            </BrowserRouter>
            <Toaster/>
        </div>
    )
}

export default App
