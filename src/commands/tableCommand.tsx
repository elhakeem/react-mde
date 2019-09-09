import * as React from "react";
import {Command} from "../types";
import {TextApi, TextState} from "../types/CommandOptions";
import {selectWord} from "../util/MarkdownUtil";

let td = (content:any) :string => `| ${content} `;
let tr = ( x:number, y:number, breakline: boolean = false ) => {
    let row = '';
    for (let i = 1; i <= x; i++) {
        row += td(breakline? '---': `${i}X${y}`)
    }
    row += '|';
    return row;
};

function generateMdTable(x: number, y: number) :string {
    let table = '\n';
    // Table head
    table += tr(x, 0) + '\n';
    table += tr(x, 0, true) + '\n';
    // Table body
    for (let i = 1; i <= y; i++) {
        table += tr(x, i) + '\n'
    }
    return table;
}

function makeTableCellCommand(state0: TextState, api: TextApi, x: number, y: number) {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({text: state0.text, selection: state0.selection});
    const state1 = api.setSelectionRange(newSelectionRange);
    // Add the prefix to the selection
    const state2 = api.replaceSelection(generateMdTable(x, y));
    // Adjust the selection to not contain the prefix
    api.setSelectionRange({
        start: state2.selection.end - state1.selectedText.length,
        end: state2.selection.end
    });
}

let tableMaxDimention = {x: 10, y: 10};
function cellsCommands() {
    let cells = []
    for (let x = 1; x <= tableMaxDimention.x; x++) {
        for (let y = 1; y <= tableMaxDimention.y; y++) {
            cells.push({
                name: `table-cell-${x}x${y}`,
                icon: () => <div className="table-cell-command"></div>,
                execute: (state: TextState, api: TextApi) => makeTableCellCommand(state, api, x, y),
            })
        }
    }
    return cells;
}

export const tableCommand: Command = {
    name: "table",
    buttonProps: {"aria-label": "Add Table"},
    children: cellsCommands(),
    icon: () => <i className="fas fa-table"></i>
};
