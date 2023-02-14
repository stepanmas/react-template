import { action } from 'mobx';
import { Subscription } from 'rxjs';

abstract class Model<T> {
  protected subscribes: Subscription[] = [];

  @action
  public commit(patch: Partial<T>): this {
    Object.entries(patch).forEach(([key, val]) => {
      this[key] = val;
    });
    return this;
  }

  @action
  public reset(): this {
    return this;
  }

  public unmount(): this {
    this.subscribes.forEach((sub) => sub.unsubscribe());
    this.subscribes = [];
    this.reset();
    return this;
  }

  protected on(subscription: Subscription): this {
    this.subscribes.push(subscription);
    return this;
  }
}

export default Model;
