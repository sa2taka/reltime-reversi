export interface ReversiElement {
  state: 'none' | 'black' | 'white';
  dropedTurn?: number;
}

export const none: ReversiElement = {
  state: 'none',
};

export class Board extends Array<Array<ReversiElement>> {
  public value: ReversiElement[][];

  constructor(private side: number, private board?: ReversiElement[][]) {
    super();
    if (board) {
      this.value = board;
    } else {
      this.value = this.initialBoard;
    }
  }

  private get initialBoard() {
    const board: Array<Array<ReversiElement>> = new Array(this.side).map(() =>
      new Array(this.side).fill(none)
    );
    const centerd = this.side / 2;
    board[centerd - 1][centerd - 1] = { state: 'white' };
    board[centerd - 1][centerd] = { state: 'black' };
    board[centerd][centerd - 1] = { state: 'white' };
    board[centerd][centerd] = { state: 'black' };

    return board;
  }

  public copy() {
    const newBoard: Array<Array<ReversiElement>> = new Array(
      this.side
    ).map(() => new Array(this.side).fill(none));

    this.forEach((row, y) => {
      row.forEach((elm, x) => {
        newBoard[y][x] = Object.assign(elm);
      });
    });

    return new Board(this.side, newBoard);
  }

  public get [Symbol.species]() {
    return this.value;
  }
}
