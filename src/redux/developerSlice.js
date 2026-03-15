import {createSlice} from "@reduxjs/toolkit";

const developerSlice = createSlice({
    name: "developer",
    initialState: {
        thisDeveloper: null
    },
    reducers: {
        SetThisDeveloper: (state, action) => {
            state.thisDeveloper = action.payload;
        }
    }
});

export const {SetThisDeveloper} = developerSlice.actions;
export default developerSlice.reducer;