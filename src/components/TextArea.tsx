import * as React from "react";
import {getLineAtPosition, isListItem} from '../util/newListItem';

let clickedEnter = false;

export interface MdeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (text: string) => void;
  className?: string;
  editorRef?: (ref: HTMLTextAreaElement) => void;
  readOnly?: boolean;
  height?: number;
  textAreaProps?: Partial<
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
  >;
}

export interface Insertion {
  text: string;
  position: number;
}

export const insertText = (text: string, position: number, insertText: string): Insertion => {
  const start = text.slice(0, position);
  const end = text.slice(position);
  return {
    text: start + insertText + end,
    position: (start + insertText).length
  };
}

function setCaretPosition(caretPos) {
  const elem:any = document.getElementById('mde-textarea');
  elem.value = elem.value
  if(elem != null) {
      if(elem.createTextRange) {
          var range = elem.createTextRange();
          range.move('character', caretPos);
          range.select();
          return true;
      }
      else {
          if(elem.selectionStart || elem.selectionStart === 0) {
              elem.focus();
              elem.setSelectionRange(caretPos, caretPos);
              return true;
          }
          else
              elem.focus();
              return false;
      }
  }
}

export class TextArea extends React.Component<MdeEditorProps, {}> {

  handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!clickedEnter) {
      const { onChange } = this.props;
      let { value } = event.target;
      onChange(value);
    }
    clickedEnter = false
  };

  handleOnBlur = () => {
    this.props.onBlur(this.props.value)
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      clickedEnter = true;
      let {selectionStart, value} = event.target;
      let currentLine = getLineAtPosition(value, selectionStart)
      let newValue: string = "\n";

      // Add spaces of the line.
      if (isListItem(currentLine.type)) {
        for (let i = 0; i < currentLine.treePosition * 4; i++) {
          newValue += ' ';
        }
      }

      // Add prefix of the line
      if (currentLine.type === 'ol') {
        newValue += currentLine.order + '. '
      } else {
        newValue += currentLine.prefix
      }

      const insertion: Insertion = insertText(event.target.value, event.target.selectionStart, newValue)
      this.props.onChange(insertion.text);
      
      setTimeout(() => {
        setCaretPosition(insertion.position);
        clickedEnter = false;
      }, 0)

    }
  }

  render() {
    const {
      className,
      readOnly,
      textAreaProps,
      height,
      editorRef,
      value
    } = this.props;
    return (
      <textarea
        dir="rtl"
        id="mde-textarea"
        className={`mde-text ${className || ""}`}
        style={{ height }}
        ref={editorRef}
        onChange={this.handleOnChange}
        readOnly={readOnly}
        onBlur={this.handleOnBlur}
        onKeyPress={this.handleKeyPress}
        required
        value={value}
        {...textAreaProps}
        data-testid="text-area"
      />
    );
  }
}
