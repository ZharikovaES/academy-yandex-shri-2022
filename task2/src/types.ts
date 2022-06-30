export type Labyrinth = {
    data: Uint8Array,
    width: number,
    height: number,
};

export type Point = {
    x: number,
    y: number,
}

// 1 - can move, 0 - can't
export const enum Meta {
    Start  = 0b0000001,
    Finish = 0b0000010,
    Top    = 0b0000100,
    Right  = 0b0001000,
    Bottom = 0b0010000,
    Left   = 0b0100000,
    Known  = 0b1000000,
}