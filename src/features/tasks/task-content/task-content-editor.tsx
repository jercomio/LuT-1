"use client";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import React from "react";
import RichTextEditor, { useEditorState } from "reactjs-tiptap-editor";
import "reactjs-tiptap-editor/style.css";
import { EditorBubbleMenu } from "./editor-bubble-menu";
import { extensions } from "./editor.config";
import "./task-content-editor.css";

type TaskContentEditorProps = {
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const TaskContentEditor: React.FC<TaskContentEditorProps> = ({
  value,
  disabled = false,
  onChange,
}) => {
  const { isReady, editor, editorRef } = useEditorState();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <RichTextEditor
          output="html"
          content={value}
          disabled={disabled}
          onChangeContent={onChange}
          ref={editorRef}
          dark
          maxHeight={300}
          hideBubble={true}
          hideToolbar={true}
          extensions={extensions}
          contentClass={cn("custom-editor", "disable-context-menu")}
        />
        {isReady && editor && <EditorBubbleMenu editor={editor} />}
      </ContextMenuTrigger>
    </ContextMenu>
  );
};
