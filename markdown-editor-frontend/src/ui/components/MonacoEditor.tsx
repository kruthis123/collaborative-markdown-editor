import Editor from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRef } from "react";
import { editor} from "monaco-editor";

export default function MonacoEditor() {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  cons
  const editorRef = useRef<editor.IEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IEditor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      defaultLanguage="markdown"
      options={{
        minimap: { enabled: false },
        scrollbar: {
          verticalScrollbarSize: 5,
          horizontalScrollbarSize: 5,
          useShadows: false
        },
        theme: isDarkTheme ? 'vs-dark' : 'light'
      }}
      onMount={handleEditorDidMount}
      className="mt-3"
    />
  );
}