export interface Line {
    /** Line index of all lines */
    index: number;
    /** the pure text of the line */
    text: string;
    /** Line type `ordered list` | `unordered list` | `check list` | 'empty line` | `other` */
    type: 'ul' | 'ol' | 'cl' | 'empty' | 'other';
    /** item prefix if is a list item */
    prefix?: string;
    /** the order of the line in the list if is a list item */
    order?: number;
    /** Either the list item is checked or not if the type is a `check list` */
    checked?: boolean;
    /**
     * only if is a list item line. the position in the ul tree
     * => 0 = is a parent, 1 = the first child list, 2 = the second child list
     * and so on.
     */
    treePosition?: number;
  }
  
  interface ListItem {
    /** Line type `ordered list` | `unordered list` | `check list` | 'empty line` | `other` */
    type: 'ul' | 'ol' | 'cl' | 'empty' | 'other';
    /** item prefix if is a list item */
    prefix: string;
    /** the order of the line in the list if is a list item */
    order?: number;
    /** Either the list item is checked or not if the type is a `check list` */
    checked?: boolean;
    /**
     * only if is a list item line. the position in the ul tree
     * => 0 = is a parent, 1 = the first child list, 2 = the second child list
     * and so on.
     */
    treePosition: number;
  }
  
  export const isListItem = (type:string):boolean => ['ol', 'ul', 'cl'].includes(type)
  
  const getItem = (line: string):ListItem => {
    let _line = line.trimLeft();
    let spaces: string;
    let treePosition: number;
  
    // If unchecked item in check list
    if (!!_line.match(/^- \[ ] /g)) {
      spaces = line.split('- [ ] ')[0];
      treePosition = spaces.length % 4 === 0? spaces.length / 4: 0
      return {
        type: 'cl',
        prefix: '- [ ] ',
        checked: false,
        treePosition
      }
    };
  
    // if checked item in check list
    if (!!_line.match(/^- \[x] /g)) {
      spaces = line.split('- [x] ')[0];
      treePosition = spaces.length % 4 === 0? spaces.length / 4: 0
      return {
        type: 'cl',
        prefix: '- [x] ',
        checked: true,
        treePosition
      }
    };
  
    // if unordered list item
    if (!!_line.match(/^- /g)) {
      spaces = line.split('- ')[0];
      treePosition = spaces.length % 4 === 0? spaces.length / 4: 0
      return {
        type: 'ul',
        prefix: '- ',
        treePosition
      }
    };
  
    // if ordered list item
    if (!!_line.match(/^[0-9]*\. /g)) {
      let prefix = _line.match(/^[0-9]*. /g)[0];
      let order = Number(prefix.split('.')[0]) + 1
      spaces = line.split(prefix)[0]
      treePosition = spaces.length % 4 === 0? spaces.length / 4: 0
      return {
        type: 'ol',
        prefix,
        treePosition,
        order
      }
    };
  
    // if an empty line
    if (_line.length === 0) {
      return {
        type: 'empty',
        prefix: '',
        treePosition: 0
      }
    };
  
    // if another line
    return {
      type: 'other',
      prefix: '',
      treePosition: 0
    }
  }
  
  /** Return the line that the cursor exists in */
  export const getLineAtPosition = (text: string, position: number) :Line => {
    let lines: string[] = text.split('\n');
    let line: Line;
    lines.forEach((l:string, index:number) => {
      position -= (l.length + 1);
      let item: ListItem = getItem(l);
      if (!line && position <= 0) {
        line = {
          ...item,
          index,
          text: l
        };
      }
    })
    return line;
  }