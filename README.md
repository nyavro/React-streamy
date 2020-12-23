# ReactRx connects RxJs with React

### connectStream 

Usage:

    // Emits tick value each second:
    const ticksObservable = interval(1000).pipe(map((tick) => ({tick})));
    ...
    // Component to attach observable to:
    const ShowTicks = (props: {tick: number}) => (<div>Ticks: {props.tick}</div>);
    ...
    // Idle component to show before first value emitted:
    const Idle = () => (<div>No data</div>);
    ...
    // Connected:
    const Connected = connectStream(ShowTicks, ticksObservable, Idle); 
   
    
