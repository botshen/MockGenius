import { JSONEditor } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";
import "./json.scss";

export default function SvelteJSONEditor(props) {
  const refContainer = useRef(null);
  const refEditor = useRef(null);

  useEffect(() => {
    refEditor.current = new JSONEditor({
      target: refContainer.current,
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
    console.log('props', props)
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props.content]);

  return <div className="jsoneditor-wrapper" ref={refContainer}></div>;
}
