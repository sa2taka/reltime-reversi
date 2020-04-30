import { ReversiCPU } from './reversiCPU';

export default class BeginnerCPU extends ReversiCPU {
  public next() {
    return this.sortByNearest()[0];
  }

  private sortByNearest() {
    const sorted = this.reversi.settableList(this.color).slice();

    return sorted.sort((a, b) => {
      const distanceA = Math.sqrt(
        (this._nowX - a.x) ** 2 + (this._nowY - a.y) ** 2
      );
      const distanceB = Math.sqrt(
        (this._nowX - b.x) ** 2 + (this._nowY - b.y) ** 2
      );
      return distanceA - distanceB;
    });
  }
}
