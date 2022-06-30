const INHERITED_PROPERTIES_ARR = ["azimuth","border-collapse","border-spacing","caption-side","color","cursor","direction","elevation","empty-cells","font-family","font-size","font-style","font-variant","font-weight","font","letter-spacing","line-height","list-style-image","list-style-position","list-style-type","list-style","orphans","pitch-range","pitch","quotes","richness","speak-header","speak-numeral","speak-punctuation","speak","speech-rate","stress","text-align","text-indent","text-transform","visibility","voice-family","volume","white-space","widows","word-spacing"
];

export default function(html, css) {
    const objStyles = {};
    css?.forEach(el => {
        objStyles[el.selector] = el.declarations;
    })
    const newHtml = setStyles(html, objStyles, {
        stylesOfParent: {}, tagParents: [], tagClosestParent: null, neighbors: [], nearestNeighbor: null
    });
    return newHtml;
}

//установка наследуемых стилей
const getParentStyles = currentStyles => {
    const objResult = {};
    if (currentStyles)
        for (const arr of Object.entries(currentStyles)) {
            const index = INHERITED_PROPERTIES_ARR.indexOf(arr[0]);
            if (index >= 0) objResult[arr[0]] = arr[1];
        }
    return objResult;
}

//установка стилей для дочерних узлов
const getChildren = (nodeHtml, css, { stylesOfParent, tagParents }) => {
    return nodeHtml.children.map((el, i) => {
        const newStylesOfParent = nodeHtml?.tag ? { ...stylesOfParent, ...getParentStyles(css[nodeHtml?.tag] ?? null) } : { ...stylesOfParent };
        const newTagParents = nodeHtml.tag ? Array.from(new Set([...tagParents, nodeHtml.tag])) : tagParents; 
        const newTagClosestParent = nodeHtml.tag ?? null;
        const newNeighbors = nodeHtml.children.filter((element, j) => j < i && element.tag).map(element => element.tag); 
        const newNearestNeighbor = i && nodeHtml.children[i - 1]?.tag ? nodeHtml.children[i - 1]?.tag : null;
        const newEl = setStyles(el, css, {
            stylesOfParent: newStylesOfParent,
            tagParents: newTagParents, 
            tagClosestParent: newTagClosestParent, 
            neighbors: newNeighbors, 
            nearestNeighbor: newNearestNeighbor
        });
        return newEl;
    });
}

//установка стилей в узел
const setStyles = (nodeHtml, css, { stylesOfParent, tagParents, tagClosestParent, neighbors, nearestNeighbor }) => {
    if (nodeHtml?.tag){
        nodeHtml.styles = { ...stylesOfParent, ...css[nodeHtml.tag] };
        tagParents.forEach(el => {
            nodeHtml.styles = { ...nodeHtml.styles, ...css[el + " " + nodeHtml.tag] };
        });
        if (tagClosestParent)
            nodeHtml.styles = { ...nodeHtml.styles, ...css[tagClosestParent + " > " + nodeHtml.tag] };
        neighbors.forEach(el => {
            nodeHtml.styles = { ...nodeHtml.styles, ...css[el + " ~ " + nodeHtml.tag] };
        });
        if (nearestNeighbor)
            nodeHtml.styles = { ...nodeHtml.styles, ...css[nearestNeighbor + " + " + nodeHtml.tag] };
    }

    if (nodeHtml?.children?.length)
        nodeHtml.children = getChildren(nodeHtml, css, { stylesOfParent, tagParents });
    return nodeHtml;
}
