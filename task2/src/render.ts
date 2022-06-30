import { Labyrinth, Meta } from './types';

const CELL_SIZE = 20;
const PADDING = 20;

export function render(labyrinth: Labyrinth): void {
    const canvas = document.getElementById('visualization') as HTMLCanvasElement;
    canvas.width = labyrinth.width * CELL_SIZE + 2 * PADDING;
    canvas.height = labyrinth.height * CELL_SIZE + 2 * PADDING;

    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (x1: number, y1: number, x2: number, y2: number): void => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    const fillCell = (x: number, y: number, color: string): void => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }

    for (let line = 0; line < labyrinth.height; line++) {
        for (let cell = 0; cell < labyrinth.width; cell++) {
            const index = line * labyrinth.width + cell;
            const data = labyrinth.data[index];

            const x = PADDING + cell * CELL_SIZE;
            const y = PADDING + line * CELL_SIZE;

            if (data & Meta.Finish) {
                fillCell(x, y, 'red');
            }

            if (data & Meta.Known) {
                fillCell(x, y, 'gray');
            }

            if (data & Meta.Start) {
                fillCell(x, y, 'green');
            }


            if ((data & Meta.Top) === 0) {
                drawLine(x, y, x + CELL_SIZE, y);
            }

            if ((data & Meta.Right) === 0) {
                drawLine(x + CELL_SIZE, y, x + CELL_SIZE, y + CELL_SIZE);
            }

            if ((data & Meta.Bottom) === 0) {
                drawLine(x, y + CELL_SIZE, x + CELL_SIZE, y + CELL_SIZE);
            }

            if ((data & Meta.Left) === 0) {
                drawLine(x, y, x, y + CELL_SIZE);
            }
        }
    }
}
