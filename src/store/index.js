import { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const initialState = {
    user: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_USER': {
            return { ...state, user: action.payload };
        }
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {props.children}
        </StoreContext.Provider>
    );
}