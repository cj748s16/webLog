import { Injectable, Component } from "@angular/core";

import * as Rx from "rxjs/Rx";

interface EventSubjectType {
    name: string,
    args: Array<any>
}

interface ObservableWithSubject {
    subject: Rx.Subject<Array<any>>;
    observable: Rx.Observable<Array<any>>;
}

@Injectable()
export class EventsService {

    private subjects = new Map<string, ObservableWithSubject>();
    private eventsSubject = new Rx.Subject<EventSubjectType>();
    private events: Rx.Observable<EventSubjectType>;

    constructor() {
        this.events = Rx.Observable.from<EventSubjectType>(this.eventsSubject);
        this.events.subscribe(a => {
            if (this.subjects.has(a.name)) {
                const obsws = this.subjects.get(a.name);
                obsws.subject.next(a.args);
            }
        });
    }

    subscribe(name: string, observerOrNext?: (value: any | Array<any>) => void, error?: (error: any) => void, complete?: () => void): Rx.Subscription {
        const subject = new Rx.Subject<Array<any>>();

        let obsws: ObservableWithSubject;
        if (this.subjects.has(name)) {
            obsws = this.subjects.get(name);
        } else {
            obsws = { subject: subject, observable: Rx.Observable.from<Array<any>>(subject) };
            this.subjects.set(name, obsws);
        }
        var obs = obsws.observable;
        return obs.subscribe(observerOrNext);
    }

    broadcast(name: string, ...args) {
        this.eventsSubject.next({ name, args });
    }
}