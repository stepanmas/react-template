import Point from '@app/shared/point';

export default class MainPoint extends Point {
  readonly base = 'section';

  public subSection() {
    this.path.push('sub-section');
    return this;
  }
}
