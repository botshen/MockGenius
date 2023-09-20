import { JSONEditor } from "vanilla-jsoneditor";
import React, { useEffect, useRef } from "react";
import "./json.scss";
interface SvelteJSONEditorProps {
  readOnly?: boolean;
  onChange?: (value: any) => void;
  mode: any;
  content: any;
  mainMenuBar?: boolean;
  statusBar?: boolean;
}

export default function SvelteJSONEditor(props: SvelteJSONEditorProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const refEditor = useRef<JSONEditor | null>(null);
 
  useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {}
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props.content]);

  return <div className="jse-theme-dark" ref={refContainer}></div>;
}
