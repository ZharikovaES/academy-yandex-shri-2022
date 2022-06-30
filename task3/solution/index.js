const TEXT_STYLES_MAPPER = {
    fontFamily: (value) => `font-family: ${value};`,
    color: (value) => `color: rgba(${value.r * 255}, ${value.g * 255}, ${value.b * 255}, ${value.a});`,
    letterSpacing: (value) => `letter-spacing: ${value}px;`,
    lineHeightPx: (value) => `line-height: ${value}px;`,
    fontSize: (value) => `font-size: ${value}px;`,
    fontWeight: (value) => `font-weight: ${value};`,
    textAlignHorizontal: (value) => `text-align: ${value.toLowerCase()};`,
    textAlignVertical: (value) => `vertical-align: ${value.toLowerCase()};`,
}
const BLOCK_STYLES_MAPPER = {
    backgroundColor: (value) => `background-color: rgba(${value.r * 255}, ${value.g * 255}, ${value.b * 255}, ${value.a});`,
    strokeWeight: (value) => `border-width: ${value}px;`,
    borderColor: (value) => `border-color: rgba(${value.r * 255}, ${value.g * 255}, ${value.b * 255}, ${value.a});`,
    borderStyle: (value) => `border-style: ${value.toLowerCase()};`,
    paddingTop: (value) => `padding-top: ${value}px;`,
    paddingBottom: (value) => `padding-bottom: ${value}px;`,
    paddingLeft: (value) => `padding-left: ${value}px;`,
    paddingRight: (value) => `padding-right: ${value}px;`,
    marginTop: (value) => `margin-top: ${value}px;`,
    marginBottom: (value) => `margin-bottom: ${value}px;`,
    marginLeft: (value) => `margin-left: ${value}px;`,
    marginRight: (value) => `margin-right: ${value}px;`,
    layoutMode: (value) => `display: flex; flex-direction: ${value === "VERTICAL" ? "column" : "row"};`,
    counterAxisAlignItems: (value) => `display: flex; align-items: ${value.toLowerCase().replace("_", "-")};`,
    primaryAxisAlignItems: (value) => `display: flex; justify-content: ${value.toLowerCase().replace("_", "-")};`,
}
const EFFECTS_MAPPER = {
    DROP_SHADOW: (value) => `box-shadow: ${value.offset?.x}px ${value.offset?.y}px ${value.radius}px rgba(${value.color?.r * 255}, ${value.color?.g * 255}, ${value.color?.b * 255}, ${value.color?.a});`,
}
const RECTANGLE_STYLES_MAPPER = {
    color: (value) => `background-color: rgba(${value.r * 255}, ${value.g * 255}, ${value.b * 255}, ${value.a});`,
}
const FLEX_MAPPER = {
    counterAxisAlignItems: (value) => `display: flex; align-items: ${value.toLowerCase().replace("_", "-")};`,
    primaryAxisAlignItems: (value) => `display: flex; justify-content: ${value.toLowerCase().replace("_", "-")};`,
}
const BOUNDING_STYLES_MAPPER = {
    width: (value) => `width: ${value}px;`,
    height: (value) => `height: ${value}px;`,
}
const PARENT_STYLES_MAPPER = {
    itemSpacing: (value, node, currentIndex, parentNode) => {
        if (parentNode.layoutMode === "VERTICAL" && currentIndex < parentNode.children?.length - 1)
            return `margin-bottom: ${value}px;`;
        if (parentNode.layoutMode === "HORIZONTAL" && currentIndex < parentNode.children?.length - 1)
            return `margin-right: ${value}px;`;
        if (parentNode.layoutMode !== "VERTICAL" && parentNode.layoutMode !== "HORIZONTAL")
            return `margin: ${value}px;`;
        return '';
    },
    layoutAlign: (value, node, currentIndex, parentNode) => {
        const styleArr = [];
        if (node.layoutAlign === "INHERIT")
            for (let [key, value] of Object.entries(parentNode))
                if (FLEX_MAPPER[key]) {
                    styleArr.push(BLOCK_STYLES_MAPPER[key](value));
                    node[key] = value;
                }
        return styleArr.join(' ');        
    }
}

const buildBlock = ({ type, content, className, style }) => {
    return `<${type} class="${className}" style="${style}">${content}</${type}>`;
};

//получение стилей от узлов-родителей
const getParentStyles = (node, currentIndex, nodeParent) => {
    if (!nodeParent) return "";
    const styleArr = [];
    for (let [key, value] of Object.entries(nodeParent))
        if (PARENT_STYLES_MAPPER[key]) styleArr.push(PARENT_STYLES_MAPPER[key](value, node, currentIndex, nodeParent));
    return styleArr.join(' ');
}

//получение стилей для узлов с типом "TEXT"
const getTextStyles = (node) => {
    const styleArr = [];
    if (node.style)
        for (let [key, value] of Object.entries(node.style))
            if (TEXT_STYLES_MAPPER[key]) styleArr.push(TEXT_STYLES_MAPPER[key](value));
    if (node.absoluteBoundingBox)
        for (let [key, value] of Object.entries(node.absoluteBoundingBox))
            if (BOUNDING_STYLES_MAPPER[key])  styleArr.push(BOUNDING_STYLES_MAPPER[key](value));
    if (node.fills?.length)
        for (let [key, value] of Object.entries(node.fills[0]))
            if (TEXT_STYLES_MAPPER[key]) styleArr.push(TEXT_STYLES_MAPPER[key](value));
    return styleArr.join(' ');
}

//получение стилей для узлов с типом "RECTANGLE"
const getRectanglesStyles = (node) => {
    const styleArr = [];
    if (node.fills?.length)
        for (let [key, value] of Object.entries(node.fills[0]))
            if (RECTANGLE_STYLES_MAPPER[key]) styleArr.push(RECTANGLE_STYLES_MAPPER[key](value));
    return styleArr.join(' ');
}

//получение стилей для узлов с остальными типами (не "TEXT" и не "RECTANGLE")
const getBlockStyles = (node) => {
    const styleArr = [];
    if (node.style)
        for (let [key, value] of Object.entries(node.style))
            if (TEXT_STYLES_MAPPER[key])
                styleArr.push(TEXT_STYLES_MAPPER[key](value));
    if (node.fills?.length)
        for (let [key, value] of Object.entries(node.fills[0]))
            if (TEXT_STYLES_MAPPER[key])
                styleArr.push(TEXT_STYLES_MAPPER[key](value));
    if (node.effects?.length)
        styleArr.push(EFFECTS_MAPPER[node.effects[0].type](node.effects[0]));
    if (node.strokeWeight && node.strokes?.length) {
        styleArr.push(BLOCK_STYLES_MAPPER.borderStyle(node.strokes[0].type));
        styleArr.push(BLOCK_STYLES_MAPPER.borderColor(node.strokes[0].color));
    }
    if (node.absoluteBoundingBox)
        for (let [key, value] of Object.entries(node.absoluteBoundingBox))
            if (BOUNDING_STYLES_MAPPER[key]) styleArr.push(BOUNDING_STYLES_MAPPER[key](value));
    for (let [key, value] of Object.entries(node))
        if (BLOCK_STYLES_MAPPER[key]) styleArr.push(BLOCK_STYLES_MAPPER[key](value));
    return styleArr.join(' ');
}

//генерация HTML-разметки для дочерних узлов
const getChildren = (childrens, nodeParent) => {
    return childrens?.length ? childrens.map((el, i) => getHTML(el, i, nodeParent)).join('') : "";
}

//генерация HTML-разметки для узлов с типами "FRAME", "CANVAS", "COMPONENT_SET", "COMPONENT" и "INSTANCE"
const getDivEl = (node, currentIndex, nodeParent) => {
    const currentStyles = getBlockStyles(node);
    const parentStyles = getParentStyles(node, currentIndex, nodeParent);
    const childrensHTML = getChildren(node?.children, node);
    return buildBlock({
        type: 'div',
        content: node.characters ?? "" + childrensHTML,
        className: node.type,
        style: parentStyles + currentStyles + "box-sizing: border-box;",
    });
}
const PRIMITIVES = {
    TEXT: (node, currentIndex, nodeParent) => {
        const currentStyles = getTextStyles(node);
        const parentStyles = getParentStyles(node, currentIndex, nodeParent);
        return buildBlock({
            type: 'span',
            content: node.characters,
            className: node.type,
            style: parentStyles + currentStyles + "box-sizing: border-box;",
        });
    },
    FRAME: getDivEl,
    CANVAS: getDivEl,
    COMPONENT_SET: getDivEl,
    COMPONENT: getDivEl,
    INSTANCE: getDivEl,
    RECTANGLE: (node, currentIndex, nodeParent) => {
        const rectStyles = getRectanglesStyles(node);
        const currentStyles = getBlockStyles(node);
        const parentStyles = getParentStyles(node, currentIndex, nodeParent);
        const childrensHTML = getChildren(node?.children, node);
        return buildBlock({
            type: 'div',
            content: node.characters ?? "" + childrensHTML,
            className: node.type,
            style: parentStyles + rectStyles + currentStyles + "box-sizing: border-box;",
        });
    },
};

const parse = (entry) => {
    return traverse(entry.children[0]);
};

//генерация HTML-разметки для узлов с указанным типом
const getHTML = (node, currentIndex = 0, nodeParent = null) => {
    return PRIMITIVES[node.type](node, currentIndex, nodeParent);
}

const traverse = (node) => {
    const result = getHTML(node);
    return result;
};

module.exports = function (json) {
    const entry = json.document.children[0];
    return parse(entry);
};
