import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name: "projects",

    initialState: {
        projectList: [],
    },

    reducers: {
        SetProjects: (state, action) => {
            state.projectList = action.payload;
        },

        AddProject: (state, action) => {
            state.projectList.push(action.payload);
        },

        UpdateProject: (state, action) => {
            const index = state.projectList.findIndex(
                (p) => p._id === action.payload._id
            );

            if (index !== -1) {
                state.projectList[index] = action.payload;
            }
        },

        DeleteProject: (state, action) => {
            state.projectList = state.projectList.filter(
                (p) => p._id !== action.payload
            );
        },

        AddUnityToProject: (state, action) => {
            const { projectId, unity } = action.payload;

            const project = state.projectList.find((p) => p._id === projectId);

            if (project) {
                if (!project.unitati) {
                    project.unitati = [];
                }

                project.unitati.push(unity);
            }
        },

        SetUnitiesForProject: (state, action) => {
            const { projectId, unities } = action.payload;

            const project = state.projectList.find((p) => p._id === projectId);

            if (project) {
                project.unitati = unities;
            }
        },

        UpdateUnityInProject: (state, action) => {
            const { projectId, unity } = action.payload;

            const project = state.projectList.find((p) => p._id === projectId);

            if (project && project.unitati) {
                const unityIndex = project.unitati.findIndex(
                    (u) => u._id === unity._id
                );

                if (unityIndex !== -1) {
                    project.unitati[unityIndex] = unity;
                }
            }
        },

        DeleteUnityFromProject: (state, action) => {
            const { projectId, unityId } = action.payload;

            const project = state.projectList.find((p) => p._id === projectId);

            if (project && project.unitati) {
                project.unitati = project.unitati.filter(
                    (u) => u._id !== unityId
                );
            }
        },
    },
});

export const {
    SetProjects,
    AddProject,
    UpdateProject,
    DeleteProject,
    AddUnityToProject,
    SetUnitiesForProject,
    UpdateUnityInProject,
    DeleteUnityFromProject,
} = projectSlice.actions;

export default projectSlice.reducer;