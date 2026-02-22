
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.jsx";
import {DeveloperRegistrationForm} from "@/layouts/developer-register-page.jsx";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<DeveloperRegistrationForm/>}/>
                </Routes>
            </BrowserRouter>
            <Toaster/>
        </div>
    )
}

export default App
