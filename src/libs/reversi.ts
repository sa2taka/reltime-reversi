import { ReversiBoard, ReversiElement } from './reversiElement';

export default class Reversi {
  private _board: ReversiBoard;
  private history: ReversiBoard[];
  private _turn = 0;

  constructor(private side: number = 8) {
    this._board = new ReversiBoard(side);
    this.history = [this._board.copy()];
  }

  public setPeace(color: 'white' | 'black', x: number, y: number) {
    this.history.push(this._board.copy());
    const elem: ReversiElement = { state: color, dropedTurn: this._turn };
    this._board.set(elem, x, y);
  }

  public get turn() {
    return this._turn;
  }

  public get board() {
    return this._board.value;
  }
}
