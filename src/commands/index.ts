import {boldCommand} from "./boldCommand";
import {italicCommand} from "./italicCommand";
import {strikeThroughCommand} from "./strikeThroughCommand";
import {CommandGroup} from "../types";
import {headerCommand} from "./headerCommand";
import {linkCommand} from "./linkCommand";
import {quoteCommand} from "./quoteCommand";
import {codeCommand} from "./codeCommand";
import {imageCommand} from "./imageCommand";
import {checkedListCommand, orderedListCommand, unorderedListCommand} from "./listCommands";
import {tableCommand} from './tableCommand'

const getDefaultCommands: () => CommandGroup[] = () => [
    {
        commands: [headerCommand, boldCommand, italicCommand, strikeThroughCommand]
    },
    {
        commands: [linkCommand, quoteCommand, codeCommand, imageCommand]
    },
    {
        commands: [unorderedListCommand, orderedListCommand, checkedListCommand]
    },
    {
        commands: [tableCommand]
    }
];

export {
    boldCommand,
    italicCommand,
    strikeThroughCommand,
    CommandGroup,
    headerCommand,
    linkCommand,
    quoteCommand,
    codeCommand,
    imageCommand,
    checkedListCommand,
    orderedListCommand,
    unorderedListCommand,
    tableCommand,
    getDefaultCommands
};
