import {Subscribable} from "rxjs";
import React, {useEffect, useState} from "react";

/**
 * Connects RxJs observable (subscribable) to React component.
 * Values emitted from observable get passed to component as props.
 * @param Component Component to connect observable to.
 * @param subscribable Subscribable instance.
 * @param Idle Idle component to show until observable start emitting.
 */
export const connectStream = <OwnProps, StreamProps> (
        Component: React.ComponentType<OwnProps & StreamProps>,
        subscribable: Subscribable<StreamProps>,
        Idle: React.ComponentType<OwnProps> = () => null
): React.ComponentType<OwnProps> => {
    return (ownProps: OwnProps) => {
        const [state, setState] = useState<StreamProps>();
        useEffect(
            () => {
                const subscription = subscribable.subscribe(
                    (item: StreamProps) => setState(item)
                );
                return () => {
                    subscription.unsubscribe();
                }
            },
            []
        );
        return !!state ? <Component {...{...ownProps, ...state}}/> : <Idle {...ownProps}/>;
    };
};