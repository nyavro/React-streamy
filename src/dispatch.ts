import {IProvider} from "./Provider";
import {useContext} from "react";

/**
 * Represents action to be processed.
 *
 * type Type of the action.
 * payload Data carried with the action.
 */
export interface Action <T> {
    type: string;
    payload: T;
}

/**
 * Dispatches action to the store.
 */
export type Dispatch = (event: Action<any>) => void;

/**
 * Hook to access dispatch. Must be called inside Provider of a context.
 *
 * @param context Context to be called in.
 */
export function useDispatch<State> (context: React.Context<IProvider<State>>) {
    return useContext(context).dispatch;
}
