import React from "react";

import { timer, Subject } from "rxjs";
import {
  scan,
  takeWhile,
  endWith,
  filter,
  takeUntil,
  repeatWhen,
  share
} from "rxjs/operators";

// ~~~~~~~~ Functional Style, 15 lines of code (30 - 15) ~~~~~~~~

const action$ = new Subject();

const snooze$ = action$.pipe(filter((value) => value === "snooze"));
const dismiss$ = action$.pipe(filter((value) => value === "dismiss"));

const alarm$ = (start) =>
  timer(0, 1000).pipe(
    scan((prev) => prev - 1, start + 1),
    takeWhile((value) => value > 0),
    endWith("Wake up!"),
    share(),
    repeatWhen(() => snooze$),
    takeUntil(dismiss$),
    endWith("Have a nice day!")
  );

export const AppFunctional = () => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const subscription = alarm$(5).subscribe(setDisplay);
    return () => subscription.unsubscribe();
  }, []);

  const snooze = () => action$.next("snooze");
  const dismiss = () => action$.next("dismiss");

  return (
    <div>
      <h2 style={{ fontSize: 40, marginBottom: 20 }}>{display}</h2>
      <button style={{ fontSize: 20 }} onClick={snooze}>
        Snooze
      </button>
      <button style={{ fontSize: 20 }} onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
};

// ~~~~~~~~ OOP Style, 53 lines of code (110 - 57) ~~~~~~~~

class Alarm {
  iv = null;
  dismissed = false;
  timerRunning = false;
  elapsedTime = 0;
  onTimeout = () => 0;
  onDismiss = () => 0;
  onTick = () => 0;

  constructor(time, interval = 1000) {
    this.time = time;
    this.interval = interval;
  }

  clearTimer() {
    clearInterval(this.iv);
    this.iv = null;
  }

  snooze() {
    if (!this.timerRunning && !this.dismissed) {
      this.elapsedTime = 0;
      this.timerRunning = true;
      this.onTick();

      this.iv = setInterval(() => {
        this.elapsedTime++;

        if (this.elapsedTime === this.time) {
          this.timerRunning = false;
          this.clearTimer();
          this.onTimeout();
        } else {
          this.onTick();
        }
      }, this.interval);

      return () => this.clearTimer();
    }
  }

  dismiss() {
    this.clearTimer();
    this.dismissed = true;
    this.timerRunning = false;

    this.onDismiss();
  }

  getRemainingTime() {
    return this.time - this.elapsedTime;
  }
}

const alarm = new Alarm(5);

export const AppOOP = () => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    alarm.onTick = () => setDisplay(alarm.getRemainingTime());
    alarm.onTimeout = () => setDisplay("Wake up!");
    alarm.onDismiss = () => setDisplay("Have a nice day!");

    return alarm.snooze();
  }, []);

  const snooze = () => alarm.snooze();
  const dismiss = () => alarm.dismiss();

  return (
    <div>
      <h2 style={{ fontSize: 40, marginBottom: 20 }}>{display}</h2>
      <button style={{ fontSize: 20 }} onClick={snooze}>
        Snooze
      </button>
      <button style={{ fontSize: 20 }} onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
};
