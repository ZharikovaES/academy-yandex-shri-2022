'use sctrict';
const el = document.createElement("div");
el.classList.add("root");

el.innerHTML = `
    <div class="el">У каждого объявления есть свои стили</div>
    <div class="el">Их не нужно менять</div>
    <div class="el">Каждое объявление должно быть свободным по высоте</div>
    <div class="el">А вот ширину нужно будет выставить</div>
    <div class="el">Ширину элемента root, при необходимости вы можете определить, но в тестах она может быть разная</div>
    <div class="el">Ширину элемента root, при необходимости вы можете определить, но в тестах она может быть разная</div>
    <div class="el">Ширину элемента root, при необходимости вы можете определить, но в тестах она может быть разная</div>
    <div class="el">Каждое объявление должно быть свободным по высоте</div>
`;
document.body.prepend(el);

//функция для получения индекса колонки минимальной высоты
function minColIndex(cols){
    const arr = [...cols].map((el, i) => ({ height: el.offsetHeight, index: i }));
    const min = Math.min(...arr.map(el => el.height));
    const index = arr.find(el => el.height === min)?.index;
    return index && index >= 0 ? index : 0;
}

function renderWaterfall(rootNode, columnCount, elementGap) {
    if (!columnCount || !rootNode) return;
    elementGap = elementGap ?? 0;

    const items = [...rootNode.children]; // извелечение массива дочерних элементов rootNode
    rootNode.innerHTML = '';

    //необходимая стилизация rootNode для добавления колонок
    rootNode.style.display = "flex";
    rootNode.style.alignItems = "flex-start";
    rootNode.style.justifyContent = "space-between";

    //создание колонок, добавление их в контейнер
    for (let i = 0; i < columnCount; i++) {
        const col = document.createElement("div");
        col.style.flex = `0 1 calc((100% - ${(columnCount - 1) * elementGap}px) / ${columnCount})`;
        rootNode.append(col);
    }

    const cols = rootNode.children; // колонки

    //добавление элментов массива items в колонку минимальной высоты
    for (let item of items){
        const indexOfMinCol = minColIndex(cols);
        item.style.marginBottom = elementGap + 'px';
        cols[indexOfMinCol].append(item);
    }

    //обнуление нижних отступов у последних элементов в колонках
    const lastChildren = [...cols].map(el => el.querySelector(".el:last-child"));
    for (const lastChild of lastChildren)
        lastChild.style.marginBottom = '0';
}

renderWaterfall(el, 3, 15);