import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCurrentDeveloper } from "@/api-calls/developer-register.js";
import { SetThisDeveloper } from "@/redux/developerSlice.js";
import { Progress } from "@/components/ui/progress";
import {SetProjects} from "@/redux/projectSlice.js";

export function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [progress, setProgress] = useState(0); // Progress bar state

    const getCurrentDeveloper = async () => {
        try {
            setProgress(10); // Start progress
            const response = await GetCurrentDeveloper();
            setProgress(70);
            if (response.success) {
                dispatch(SetThisDeveloper(response.data));
                dispatch(SetProjects(response.data.proiecte || []));
            } else {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/login");
        } finally {
            setProgress(100); // Finish progress when request completes
            setIsLoading(false); // Stop showing the progress bar
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            console.log("Getting current driver");
            getCurrentDeveloper();
        } else {
            navigate("/login");
        }
    }, [dispatch, navigate]);

    // Show progress bar while loading
    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-3/4">
                    <Progress value={progress} className="w-full" />
                </div>
            </div>
        );
    }
    return children;
}
