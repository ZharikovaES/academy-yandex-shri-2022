//движение от текущих координат
const move = {
    '0': {
        '1': async (coord, gameState, game) => {
            if (gameState.left) {
                await game.left(coord.x, coord.y);
                return { coord: { x: coord.x - 1, y: coord.y }, oldCoord: { ...coord }};
            }
            if (gameState.bottom) {
                await game.down(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y + 1 }, oldCoord: { ...coord }};
            }
            if (gameState.right) {
                await game.right(coord.x, coord.y);
                return { coord: { x: coord.x + 1, y: coord.y }, oldCoord: { ...coord }};
            }
            return { coord: null, oldCoord: null};
        },
        '-1': async (coord, gameState, game) => {
            if (gameState.right) {
                await game.right(coord.x, coord.y);
                return { coord: { x: coord.x + 1, y: coord.y }, oldCoord: { ...coord }};
            }
            if (gameState.top) {
                await game.up(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y - 1 }, oldCoord: { ...coord }};
            }
            if (gameState.left) {
                await game.left(coord.x, coord.y);
                return { coord: { x: coord.x - 1, y: coord.y }, oldCoord: { ...coord }};
            }
            return { coord: null, oldCoord: null};    
        },
    },
    '1': {
        '0': async (coord, gameState, game) => {
            if (gameState.bottom) {
                await game.down(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y + 1 }, oldCoord: { ...coord }};
            }
            if (gameState.right) {
                await game.right(coord.x, coord.y);
                return { coord: { x: coord.x + 1, y: coord.y }, oldCoord: { ...coord }};
            }
            if (gameState.top) {
                await game.up(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y - 1 }, oldCoord: { ...coord }};
            }
            return { coord: null, oldCoord: null};
        }
    }, 
    '-1': {
        '0': async (coord, gameState, game) => {
            if (gameState.top) {
                await game.up(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y - 1 }, oldCoord: { ...coord }};
            }
            if (gameState.left) {
                await game.left(coord.x, coord.y);
                return { coord: { x: coord.x - 1, y: coord.y }, oldCoord: { ...coord }};
            }
            if (gameState.bottom) {
                await game.down(coord.x, coord.y);
                return { coord: { x: coord.x, y: coord.y + 1 }, oldCoord: { ...coord }};
            }    
            return { coord: null, oldCoord: null};
        }
    }
}

//определение координат направления (старые и обновленные координаты)
async function getDirections(oldCoord, coord, gameState, game){
    const { coord: c, oldCoord: o } = await move[String(coord.x - oldCoord.x)]
                                                [String(coord.y - oldCoord.y)]
                                                (coord, gameState, game);
    if (!c || !o) return { oldCoord: { ...coord }, 
                           coord: { ...oldCoord }};
    return { oldCoord: o, coord: c };
}

export default async function main(game, start) {
    let coord = start;
    let oldCoord = {x: 0, y: -1};
    let gameState = await game.state(coord.x, coord.y);

    //обход лабиринта - движение по правой стене
    while (!gameState.finish){
        const { coord: c, oldCoord: o } = await getDirections(oldCoord, coord, gameState, game);
        coord = c;
        oldCoord = o;
        gameState = await game.state(coord.x, coord.y);
    }
    return coord;    
}
