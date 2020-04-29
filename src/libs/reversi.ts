import { ReversiBoard, ReversiElement } from './reversiElement';

interface Cell {
  x: number;
  y: number;
}

export default class Reversi {
  private finishedCallbacks: (() => any)[] = [];
  private _board: ReversiBoard;
  private history: ReversiBoard[];
  private _turn = 0;

  constructor(private side: number = 8) {
    this._board = new ReversiBoard(side);
    this.history = [this._board.copy()];
  }

  public get turn() {
    return this._turn;
  }

  public get board() {
    return this._board.value;
  }

  public settableList(color: 'white' | 'black') {
    const list: Cell[] = [];
    for (let y = 0; y < this.side; y++) {
      for (let x = 0; x < this.side; x++) {
        if (this.canSetPeace(color, x, y)) {
          list.push({
            x,
            y,
          });
        }
      }
    }
    return list;
  }

  public setPeace(color: 'white' | 'black', x: number, y: number) {
    if (this.canSetPeace(color, x, y)) {
      this.history.push(this._board.copy());

      return this.setPeaceAndTurn(color, x, y);
    }
    return false;
  }

  public registerFinishedCallback(callback: () => any) {
    this.finishedCallbacks.push(callback);
  }

  private setPeaceAndTurn(color: 'white' | 'black', x: number, y: number) {
    const direction: Array<-1 | 0 | 1> = [-1, 0, 1];
    let isSetted = false;

    direction.forEach(dy => {
      direction.forEach(dx => {
        const direction = {
          x: dx,
          y: dy,
        };
        if (this.canSetPeaceToOneDirection(color, x, y, direction)) {
          this.setLinePeace(color, x, y, direction);
          isSetted = true;
        }
      });
    });
    // おく場所に既に石が置かれているとcanSetPeaceToOneDirectionがfalseになるため、最後に置く
    this.setOnePeace(color, x, y);

    if (isSetted) {
      if (
        this.settableList('black').length === 0 &&
        this.settableList('white').length === 0
      ) {
        this.onFinish();
      }
    }
    return isSetted;
  }

  private setOnePeace(
    color: 'white' | 'black',
    x: number,
    y: number,
    turned?: boolean
  ) {
    const stateHistory = this._board.value[y][x].stateHistory.slice();
    stateHistory.push(this._board.value[y][x]);

    const elem: ReversiElement = {
      state: color,
      dropedTurn: this._turn,
      stateHistory,
      turned,
    };

    this._board.value[y][x] = elem;
  }

  private setLinePeace(
    color: 'white' | 'black',
    x: number,
    y: number,
    direction: {
      x: -1 | 0 | 1;
      y: -1 | 0 | 1;
    }
  ) {
    let nextX = x;
    let nextY = y;
    let i = 0;

    while (true) {
      nextX += direction.x;
      nextY += direction.y;
      i += 1;

      const next = this._board.value[nextY][nextX].state;
      if (next === color) {
        return;
      } else {
        this.setOnePeace(color, nextX, nextY, true);
      }
    }
  }

  private canSetPeace(color: 'white' | 'black', x: number, y: number) {
    const direction: Array<-1 | 0 | 1> = [-1, 0, 1];

    let canSet = false;

    direction.forEach(dy => {
      direction.forEach(dx => {
        const direction = {
          x: dx,
          y: dy,
        };
        if (this.canSetPeaceToOneDirection(color, x, y, direction)) {
          canSet = true;
        }
      });
    });

    return canSet;
  }

  private canSetPeaceToOneDirection(
    color: 'white' | 'black',
    x: number,
    y: number,
    direction: {
      x: -1 | 0 | 1;
      y: -1 | 0 | 1;
    }
  ) {
    if (direction.x === 0 && direction.y === 0) {
      return false;
    }

    const state = this._board.value[y][x].state;
    if (state !== 'none') {
      return false;
    }

    let nextX = x;
    let nextY = y;
    let i = 0;

    /*
    条件
    ①盤外へ出たらfalse
    ②自分であった場合
        ②-1iが1だった場合は隣が自分→false
        ②-2iが2だった場合取得可能→true
    ③noneだった場合はそれでに自分のコマがない→false
    敵だった場合は検証を続けるので特に何もしない
    */
    while (true) {
      nextX += direction.x;
      nextY += direction.y;
      i += 1;

      // ①盤外へ出たらfalse
      if (nextX < 0 || nextX >= this.side || nextY < 0 || nextY >= this.side) {
        return false;
      }

      const next = this._board.value[nextY][nextX].state;
      // ②自分であった場合
      if (next === color) {
        //  ②-1iが1だった場合は隣が自分→false
        if (i <= 1) {
          return false;
        }

        //②-2iが2だった場合取得可能→true
        if (i > 1) {
          return true;
        }
      }

      // ③noneだった場合はそれでに自分のコマがない→false
      if (next === 'none') {
        return false;
      }
    }
  }

  private onFinish() {
    this.finishedCallbacks.forEach(callback => {
      callback();
    });
  }
}
