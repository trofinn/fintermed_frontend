
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.jsx";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>

                </Routes>
            </BrowserRouter>
            <Toaster/>
        </div>
    )
}

export default App
