import { HtmlNode } from './types';

export const html: HtmlNode = {
    "type": "ELEMENT",
    "tag": "parent",
    "styles": {},
    "children": [
        {
            "type": "TEXT",
            "text": "\n    "
        },
        {
            "type": "ELEMENT",
            "tag": "tag",
            "styles": {},
            "children": [
                {
                    "type": "TEXT",
                    "text": "text1"
                }
            ]
        },
        {
            "type": "ELEMENT",
            "tag": "tag2",
            "styles": {},
            "children": [
                {
                    "type": "TEXT",
                    "text": "text1"
                }
            ]
        },
        {
            "type": "ELEMENT",
            "tag": "tag3",
            "styles": {},
            "children": [
                {
                    "type": "TEXT",
                    "text": "text2"
                }
            ]
        },
        {
            "type": "ELEMENT",
            "tag": "tag3",
            "styles": {},
            "children": [
                {
                    "type": "TEXT",
                    "text": "text3"
                }
            ]
        },
        {
            "type": "ELEMENT",
            "tag": "tag",
            "styles": {},
            "children": [
                {
                    "type": "TEXT",
                    "text": "text2"
                },
                {
                    "type": "TEXT",
                    "text": "text3"
                },
            ]
        },
        {
            "type": "ELEMENT",
            "tag": "block1",
            "styles": {},
            "children": [
                {
                    "type": "ELEMENT",
                    "tag": "block2",
                    "styles": {},
                    "children": [
                        {
                            "type": "TEXT",
                            "text": "block2"
                        },
                        {
                            "type": "ELEMENT",
                            "tag": "block2",
                            "styles": {},
                            "children": [
                                {
                                    "type": "TEXT",
                                    "text": "block2"
                                },
                                
                            ]
                        },

                    ]
                },
                        {
                    "type": "TEXT",
                    "text": "text3"
                },
            ]
        },
        {
            "type": "TEXT",
            "text": "\n"
        }
    ]
};

export const css = [
    {
        "selector": "parent",
        "declarations": {
            "color": "rgb(0, 255, 0)",
            "font-size": "15px"
        }
    },
    {
        "selector": "tag",
        "declarations": {
            "color": "rgb(255, 0, 0)",
            "background-color": "rgb(200, 200, 200)"
        }
    },
    {
        "selector": "tag + tag",
        "declarations": {
            "margin-left": "15px"
        }
    },
    {
        "selector": "tag2 ~ tag3",
        "declarations": {
            "color": "rgb(107 173 229)"
        }
    },
    {
        "selector": "block1 block2",
        "declarations": {
            "display": "block",
            "padding": "10px",
        }
    },
    {
        "selector": "block1 > block2",
        "declarations": {
            "background-color": "rgb(145 107 229)",
            "display": "block",
            "height": "50px",
        }
    },
    {
        "selector": "block2",
        "declarations": {
            "background-color": "rgb(14 17 229)"
        }
    },
];
