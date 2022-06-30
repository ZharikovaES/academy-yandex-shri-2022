import { Labyrinth, Meta, Point } from './types.js';

export function generateLabyrinth(width: number, height: number, start: Point, finish: Point): Labyrinth {
    const data = new Uint8Array(width * height);

    // Nulify inner borders for first row
    for (let cell = 0; cell < width; cell++) {
        if (cell !== 0) {
            data[cell] |= Meta.Left;
        }

        if (cell !== width - 1) {
            data[cell] |= Meta.Right;
        }
    }

    for (let line = 1; line < height; line++) {
        let pickedNum = 0;
        for (let cell = 0; cell < width; cell++) {
            const index = line * width + cell;
            const isPicked = Math.random() > 0.5;
            if (isPicked && cell !== width - 1) {
                data[index] |= Meta.Right;
                data[index + 1] |= Meta.Left;
                pickedNum++;
            } else {
                const bottomIndex = index - Math.round(pickedNum * Math.random());
                const topIndex = bottomIndex - width;

                data[topIndex] |= Meta.Bottom;
                data[bottomIndex] |= Meta.Top;

                pickedNum = 0;
            }
        }
    }

    data[start.x + start.y * width] |= (Meta.Start | Meta.Known);
    data[finish.x + finish.y * width] |= Meta.Finish;

    return { data, width, height };
}
