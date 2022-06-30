import { Labyrinth, Meta } from './types.js';

const timer = (time: number) => new Promise(res => setTimeout(res, time * Math.random()));

export class Game {
    readonly #data: Uint8Array;
    readonly #height: number;
    readonly #width: number;
    readonly #delay: number;

    constructor(labyrinth: Labyrinth, delay: number = 1000) {
        this.#data = labyrinth.data
        this.#height = labyrinth.height;
        this.#width = labyrinth.width;
        this.#delay = delay;
    }

    #at(x: number, y: number) {
        if (x >= this.#width || y >= this.#height || x < 0 || y < 0) {
            throw 'out';
        }

        return this.#data[x + y * this.#width];
    }

    async #checkIsKnown(x: number, y: number) {
        await timer(this.#delay);

        const cell = this.#at(x, y);
        
        if (cell & Meta.Known) {
            return;
        }

        throw 'access error';
    }

    #checkCanMove(x: number, y: number, dir: Meta.Top | Meta.Right | Meta.Bottom | Meta.Left) {
        const cell = this.#at(x, y);
        if (cell & dir) {
            return;
        }

        throw 'wall';
    }

    #markAsKnown(x: number, y: number) {
        this.#at(x, y);

        this.#data[x + y * this.#width] |= Meta.Known;
    }

    async up(x: number, y: number) {
        await this.#checkIsKnown(x, y);
        this.#checkCanMove(x, y, Meta.Top);
        this.#markAsKnown(x, y - 1);
    }

    async down(x: number, y: number) {        
        await this.#checkIsKnown(x, y);
        this.#checkCanMove(x, y, Meta.Bottom);
        this.#markAsKnown(x, y + 1);
    }

    async left(x: number, y: number) {
        await this.#checkIsKnown(x, y);
        this.#checkCanMove(x, y, Meta.Left);
        this.#markAsKnown(x - 1, y);
    }

    async right(x: number, y: number) {
        await this.#checkIsKnown(x, y);
        this.#checkCanMove(x, y, Meta.Right);
        this.#markAsKnown(x + 1, y);
    }

    async state(x: number, y: number) {
        await this.#checkIsKnown(x, y);

        const state = this.#at(x, y);

        return {
            top: !!(state & Meta.Top),
            bottom: !!(state & Meta.Bottom),
            left: !!(state & Meta.Left),
            right: !!(state & Meta.Right),
            start: !!(state & Meta.Start),
            finish: !!(state & Meta.Finish)
        }
    }
}
