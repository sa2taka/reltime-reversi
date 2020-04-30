import Reversi, { Cell } from '@/libs/reversi';

export abstract class ReversiCPU {
  protected _nowX: number;
  protected _nowY: number;

  constructor(protected reversi: Reversi, protected _color: 'white' | 'black') {
    const side = Math.floor(this.reversi.board.length);
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        this._nowX = _color === 'black' ? side - 1 : side;
        this._nowY = side - 2;
        break;
      case 1:
        this._nowX = side + 1;
        this._nowY = _color === 'black' ? side : side - 1;
        break;
      case 2:
        this._nowX = _color === 'black' ? side - 1 : side;
        this._nowY = side + 1;
        break;
      case 3:
        this._nowX = side - 2;
        this._nowY = _color === 'black' ? side : side - 1;
        break;
      default:
        this._nowX = _color === 'black' ? side - 1 : side;
        this._nowY = side - 2;
    }
  }

  abstract next(): Cell;

  public get noxX() {
    return this._nowX;
  }

  public get noxY() {
    return this._nowY;
  }

  public get color() {
    return this._color;
  }
}
