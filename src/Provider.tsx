import React, {ProviderProps, useEffect, useMemo, useState} from "react";
import {Subject, zip} from "rxjs";
import {map} from "rxjs/operators";
import {Reducer} from "./reducer";
import {Action, Dispatch} from "./dispatch";

/**
 * reducer Store modification function.
 * Context
 */
interface IProps <S> extends ProviderProps <S> {
    reducer: Reducer <S>;
    Context: React.Context<IProvider<S>>;
}

export interface IProvider <S> {
    state: S;
    dispatch: Dispatch;
}

export function Provider<S>({value, reducer, Context, children}: IProps<S>) {
    const [state, setState] = useState<S>(value);
    const dispatchSubject = useMemo(() => new Subject<Action<any>>(), []);
    useEffect(
        () => {
            const storeSubject = new Subject<S>();
            const subscription = zip(storeSubject, dispatchSubject).pipe(
                map(([state, action]) => reducer(state, action))
            ).subscribe(
                (newState) => {
                    storeSubject.next(newState);
                    setState(newState);
                }
            );
            storeSubject.next(value);
            return () => {
                subscription.unsubscribe();
            };
        }, [reducer, value, dispatchSubject]
    );
    const dispatch = (event: Action<any>) => {
        dispatchSubject.next(event);
    }
    return (<Context.Provider value={{state: state, dispatch}}>{children}</Context.Provider>);
}