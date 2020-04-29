<template>
  <div class="reversi">
    <input v-model="input" @change="handleSideChange" />

    <canvas id="reversi-board" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Reversi from '@/libs/reversi';
import { ReversiElement } from '@/libs/reversiElement';

@Component
export default class ReversiDisplay extends Vue {
  input = '8';
  side = 8;
  reversi = new Reversi(8);

  color: 'black' | 'white' = 'black';

  // Reversi canvas arg
  columnSide = 48;
  padding = 64;
  gapX = 0;
  gapY = 0;

  canvasWindowSide = 100;

  context: CanvasRenderingContext2D | null = null;

  created() {
    this.reversi.registerFinishedCallback(() => {
      console.log('finish');
    });
  }

  mounted() {
    window.addEventListener('resize', () => {
      this.handleWindowSize();
      this.draw();
    });
    const canvas = document.getElementById(
      'reversi-board'
    ) as HTMLCanvasElement;
    canvas.addEventListener('click', this.handleCanvasClick);
    this.context = canvas.getContext('2d');

    // draw and window
    this.handleWindowSize();
    this.initialGap();
    this.draw();
  }

  handleSideChange() {
    const numSide = Number(this.input);
    if (numSide >= 6 && numSide <= 100) {
      this.reversi = new Reversi(numSide);
      this.side = numSide;
      this.initialGap();
      this.draw();
    }
  }

  handleWindowSize() {
    this.canvasWindowSide =
      window.innerWidth > window.innerHeight * 0.8
        ? window.innerHeight * 0.8
        : window.innerWidth;

    const canvas = document.getElementById(
      'reversi-board'
    ) as HTMLCanvasElement;
    canvas.width = this.canvasWindowSide;
    canvas.height = this.canvasWindowSide;
  }

  initialGap() {
    const side = this.columnSide * this.side;
    this.gapX = (this.canvasWindowSide - side) / 2;
    this.gapY = (this.canvasWindowSide - side) / 2;
  }

  draw() {
    if (this.context) {
      this.clearCanvas();
      this.drawFrame();
      this.drawPeaces();
      this.drawCenter();
    }
  }

  drawCenter() {
    this.context!.beginPath();
    this.context!.moveTo(this.canvasWindowSide / 2, 0);
    this.context!.lineTo(this.canvasWindowSide / 2, this.canvasWindowSide);
    this.context!.lineWidth = 3;
    this.context!.stroke();

    this.context!.beginPath();
    this.context!.moveTo(0, this.canvasWindowSide / 2);
    this.context!.lineTo(this.canvasWindowSide, this.canvasWindowSide / 2);
    this.context!.lineWidth = 3;
    this.context!.stroke();
  }

  clearCanvas() {
    const canvas = document.getElementById(
      'reversi-board'
    ) as HTMLCanvasElement;
    this.context!.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawFrame() {
    const side = this.columnSide * this.side;

    this.context!.beginPath();
    this.context!.fillStyle = 'rgb(0, 140, 0)';
    this.context!.fillRect(this.gapX, this.gapY, side, side);

    this.context!.beginPath();
    this.context!.rect(this.gapX, this.gapY, side, side);
    this.context!.lineWidth = 5;
    this.context!.stroke();

    for (let i = 1; i < this.side; i++) {
      this.context!.beginPath();
      this.context!.moveTo(this.gapX, this.gapY + i * this.columnSide);
      this.context!.lineTo(this.gapX + side, this.gapY + i * this.columnSide);
      this.context!.lineWidth = 1;
      this.context!.stroke();

      this.context!.beginPath();
      this.context!.moveTo(this.gapX + i * this.columnSide, this.gapY);
      this.context!.lineTo(this.gapX + i * this.columnSide, this.gapY + side);
      this.context!.lineWidth = 1;
      this.context!.stroke();
    }
  }

  drawPeaces() {
    this.reversi.board.forEach((row, y) => {
      row.forEach((column, x) => {
        this.drawPeace(column, x, y);
      });
    });
  }

  drawPeace(elem: ReversiElement, x: number, y: number) {
    if (elem.state === 'none') {
      return;
    }
    const side = this.columnSide * this.side;

    this.context!.beginPath();

    this.context!.arc(
      this.gapX + this.columnSide * x + this.columnSide / 2,
      this.gapY + this.columnSide * y + this.columnSide / 2,
      this.columnSide / 2 - 4,
      (0 * Math.PI) / 180,
      (360 * Math.PI) / 180
    );

    if (elem.state === 'white') {
      this.context!.fillStyle = 'rgba(255,255, 255)';
    } else {
      this.context!.fillStyle = 'rgba(0,0, 0)';
    }

    this.context!.fill();
  }

  // event listner

  handleCanvasClick(e: MouseEvent) {
    const rect = (e.target! as Element).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - this.gapX) / this.columnSide);
    const y = Math.floor((e.clientY - rect.top - this.gapY) / this.columnSide);

    if (x >= 0 && x < this.side && y >= 0 && y < this.side) {
      if (this.reversi.setPeace(this.color, x, y)) {
        this.draw();
        this.color = this.color === 'black' ? 'white' : 'black';

        if (this.reversi.settableList(this.color).length === 0) {
          this.color = this.color === 'black' ? 'white' : 'black';
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#reversi-board {
  display: block;
  margin: auto auto;
  overflow: hidden;
}
</style>
