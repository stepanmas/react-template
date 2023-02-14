import React from 'react';
import { Subscription } from 'rxjs';

export interface IControllerProps {

}

export interface IControllerState {
  loading: string[];
}

export interface ISubManagerStore {
  get: (subName: string) => Subscription | undefined;
  off: (subName?: string) => ISubManagerStore;
  on: (subName: string, sub: Subscription) => ISubManagerStore;
  state: Map<string, Subscription>;
}

type IInputProps<T = Record<string, unknown>> = T & IControllerProps;
type IInputState<T = Record<string, unknown>> = T & IControllerState;

class Controller<PROPS = {}, STATE = {}, SS = any> extends React.Component<IInputProps<PROPS>, IInputState<STATE>, SS> {
  public state = {
    loading: [],
  } as unknown as IInputState<STATE>;

  public loadManager = {
    on: (name: string) => this.setState((prevState) => ({
      ...prevState,
      loading: [...prevState.loading, name],
    })),
    off: (name: string) => this.setState((prevState) => ({
      ...prevState,
      loading: this.state.loading.filter((cur) => cur !== name),
    })),
    is: (name: string) => this.state.loading.includes(name),
  };

  public subManager: ISubManagerStore = {
    get: (subName: string) => this.subManager.state.get(subName),
    off: (subName?: string) => {
      if (subName) {
        this.subManager.state.get(subName)?.unsubscribe();
      } else {
        this.subManager.state.forEach((s: Subscription) => s.unsubscribe());
      }
      return this.subManager;
    },
    on: (subName: string, sub: Subscription) => {
      this.subManager.off(subName).state.set(subName, sub);
      return this.subManager;
    },
    state: new Map<string, Subscription>(),
  };

  constructor(props: PROPS = {} as PROPS) {
    super(props as any);
  }

  public componentWillUnmount() {
    this.subManager.off();
  }
}

export default Controller;
