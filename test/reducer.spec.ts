import {combineReducers, Reducer} from "../src/reducer";
import {Action} from "../src/dispatch";

describe('Reducers convert state', () => {
    test('Combines reducers empty map', () => {
        interface IStore {}
        const combined = combineReducers<IStore>({});
        expect(combined({}, {type:"", payload: "value"})).toStrictEqual({});
    });
    test('Combines reducers single', () => {
        interface IStore {
            key: string;
        }
        const reduceKey: Reducer<string> = (store: string, action: Action<string>) => store + "." + action.payload;
        const combined = combineReducers<IStore>({key: reduceKey});
        expect(combined({key: "initial"}, {type:"", payload: "value"})).toStrictEqual({key: "initial.value"});
    });
    test('Combines reducers', () => {
        interface IStore {
            key1: string;
            key2: number;
        }
        const reduce1: Reducer<string> = (store: string, action: Action<string>) => store + "." + action.payload;
        const reduce2: Reducer<number> = (store: number, action: Action<number>) => store + 1;
        const combined = combineReducers<IStore>({key1: reduce1, key2: reduce2});
        expect(combined({key1: "initial", key2: 0}, {type:"", payload: "value"})).toStrictEqual({key1: "initial.value", key2: 1});
    });
    test('Combines reducers 2', () => {
        interface Inner {
            key: string;
        }
        interface IStore {
            key1: string;
            key2: number;
            key3: Inner;
        }
        const reduce1: Reducer<string> = (store: string, action: Action<string>) => store + "." + action.payload;
        const reduce2: Reducer<number> = (store: number, action: Action<number>) => store + 1;
        const reduce3: Reducer<Inner> = (store: Inner, action: Action<Inner>) => ({key: store.key + ".done"});
        const combined = combineReducers<IStore>({
            key1: reduce1,
            key2: reduce2,
            key3: reduce3
        });
        expect(combined({key1: "initial", key2: 0, key3: {key: "inner"}}, {type:"", payload: "value"}))
            .toStrictEqual({key1: "initial.value", key2: 1, key3: {key: "inner.done"}});
    });
});