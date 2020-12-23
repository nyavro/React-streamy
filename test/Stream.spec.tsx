import {act, render, screen} from "@testing-library/react";
import React from "react";
import {NEVER, Subject, Subscribable, Unsubscribable} from "rxjs";
import {connectStream} from "../src/Stream";
// import {act} from "react-dom/test-utils";
// import {mock} from "jest-mock-extended";
// import {Unsubscribable} from "@reactivex/rxjs/src/internal/types";
import '@testing-library/jest-dom';
import {mock} from "jest-mock-extended";
const Idle = () => (<div data-testid='idle'>No data emitted yet</div>);

const ShowValueComponent = (props: {value: string}) => (<div data-testid='main'>{props.value}</div>);

describe('Connect observable to React component', () => {
    test('renders idle component until observable emit first item', () => {
        const ConnectedShowValue = connectStream(ShowValueComponent, NEVER, Idle);
        render(<ConnectedShowValue/>);
        const idle = screen.getByTestId("idle");
        expect(idle).toBeInTheDocument();
        expect(idle).toHaveTextContent('No data emitted yet');
        expect(screen.queryByTestId('main')).not.toBeInTheDocument();
    });
    test('renders first item of the observable', () => {
        const subject = new Subject<{value:string}>();
        const ConnectedShowValue = connectStream(ShowValueComponent, subject, Idle);
        render(<ConnectedShowValue/>);
        const idle = screen.getByTestId('idle');
        expect(idle).toBeInTheDocument();
        expect(screen.queryByTestId('main')).not.toBeInTheDocument();
        act(() => {
            subject.next({value: 'first'});
        });
        const main = screen.getByTestId('main');
        expect(main).toBeInTheDocument();
        expect(main).toHaveTextContent('first');
        expect(screen.queryByTestId('idle')).not.toBeInTheDocument();
    });
    test('renders all items of the observable', () => {
        const subject = new Subject<{value:string}>();
        const ConnectedShowValue = connectStream(ShowValueComponent, subject, Idle);
        render(<ConnectedShowValue/>);
        expect(screen.queryByTestId('main')).not.toBeInTheDocument();
        act(() => {
            subject.next({value: 'first'});
        });
        expect(screen.getByTestId('main')).toHaveTextContent('first');
        act(() => {
            subject.next({value: 'second'});
        });
        expect(screen.getByTestId('main')).toHaveTextContent('second');
    });

    test('unsubscribes when component gets unmounted', () => {
        const subscribableMock = mock<Subscribable<{value: string}>>();
        const subscriptionMock = mock<Unsubscribable>();
        subscribableMock.subscribe.mockReturnValue(subscriptionMock);
        const ConnectedShowValue = connectStream(ShowValueComponent, subscribableMock, Idle);
        const {unmount} = render(<ConnectedShowValue/>);
        expect(subscribableMock.subscribe).toHaveBeenCalled();
        expect(subscriptionMock.unsubscribe).not.toHaveBeenCalled();
        unmount();
        expect(subscriptionMock.unsubscribe).toHaveBeenCalled();
    });
});
