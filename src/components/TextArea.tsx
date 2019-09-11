import * as React from "react";

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

export class TextArea extends React.Component<MdeEditorProps, {}> {
  handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = this.props;
    onChange(event.target.value);
  };
  handleOnBlur = () => {
    this.props.onBlur(this.props.value)
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
        className={`mde-text ${className || ""}`}
        style={{ height }}
        ref={editorRef}
        onChange={this.handleOnChange}
        readOnly={readOnly}
        onBlur={this.handleOnBlur}
        required
        value={value}
        {...textAreaProps}
        data-testid="text-area"
      />
    );
  }
}
