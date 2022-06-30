import { Game } from './src/game.js';
import { generateLabyrinth } from './src/labyrinth-generator.js';
import { render } from './src/render.js';
import main from './src/main.js';

const WIDTH = 50;
const HEIGHT = 50;

const start = { x: 0, y: 0 };
const finish = { x: WIDTH / 2, y: HEIGHT / 2 };

let labyrinth = generateLabyrinth(WIDTH, HEIGHT, start, finish);

const game = new Game(labyrinth, 100);

main(game, start)
    .then(({ x, y }) => x == finish.x && y == finish.y)
    .then(console.log);

// ---------------
// UI
// ---------------
function renderLoop() {
    render(labyrinth);
    setTimeout(() => requestAnimationFrame(renderLoop), 100);
}

requestAnimationFrame(renderLoop);

function onDOMContentLoaded(): void {
    const onGenerateClick = () => {
        labyrinth = generateLabyrinth(WIDTH, HEIGHT, start, finish);
    };

    document
        .getElementById('generate')
        ?.addEventListener('click', onGenerateClick);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)
