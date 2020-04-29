export interface ReversiElement {
  state: 'none' | 'black' | 'white';
  dropedTurn?: number;
  stateHistory: ReversiElement[];
  turned?: boolean;
}

export const none: ReversiElement = {
  state: 'none',
  stateHistory: [],
};

export class ReversiBoard {
  private _value: ReversiElement[][];

  constructor(private side: number, private board?: ReversiElement[][]) {
    if (board) {
      this._value = board;
    } else {
      this._value = this.initialBoard;
    }
  }

  private get initialBoard() {
    const board: Array<Array<ReversiElement>> = Array.from(
      new Array(this.side),
      () => new Array(this.side).fill(none)
    );
    const centerd = Math.floor(this.side / 2);
    board[centerd - 1][centerd - 1] = { state: 'black', stateHistory: [] };
    board[centerd - 1][centerd] = { state: 'white', stateHistory: [] };
    board[centerd][centerd - 1] = { state: 'white', stateHistory: [] };
    board[centerd][centerd] = { state: 'black', stateHistory: [] };

    return board;
  }

  public copy() {
    const newBoard: Array<Array<ReversiElement>> = Array.from(
      new Array(this.side),
      () => new Array(this.side).fill(none)
    );

    this._value.forEach((row, y) => {
      row.forEach((elm, x) => {
        newBoard[y][x] = Object.assign(elm);
      });
    });

    return new ReversiBoard(this.side, newBoard);
  }

  public set(elem: ReversiElement, x: number, y: number) {
    this._value[y][x] = elem;
  }

  public get value() {
    return this._value;
  }
}
