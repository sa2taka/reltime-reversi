import { Board, ReversiElement, none } from './reversiElement';

export default class Reversi {
  private board: Board;
  private history: Board[];

  constructor(private side: number = 8) {
    this.board = new Board(side);
    this.history = [this.board.copy()];
  }
}
