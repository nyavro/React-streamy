import {Action} from "./dispatch";

/**
 * Creates new state from old one according to action.
 */
export type Reducer<S, A = any> = (state: S, action: Action<A>) => S

/**
 * Map of reducers.
 */
type ReducersMap <S> = {
    [K in keyof S]: Reducer<S[K]>
}

/**
 * Combines reducers map into reducer.
 *
 * @param reducers Map of reducers.
 */
export function combineReducers<S>(reducers: ReducersMap <S>): Reducer<S> {
    return (state: S, action: Action<any>) =>
        Object
            .keys(state)
            .reduce(
                (acc, key) => {
                    const k = key as (keyof S);
                    return {...acc, [k]: reducers[k](state[k], action)}
                },
                state
            );
}