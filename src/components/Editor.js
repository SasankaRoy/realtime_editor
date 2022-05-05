import React, { useEffect, useRef } from "react";
import codeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import Events from "../Events";
// const textA = document.getElementById('RTeditor');

export const Editor = ({ socketRef, roomId, getCode }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = codeMirror.fromTextArea(
        document.getElementById("RTeditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, value) => {
        const { origin } = value;
        const code = instance.getValue();
        getCode(code);
        if (origin !== "setValue") {
          // console.log(" first working");
          socketRef.current.emit(Events.Code_Change, {
            roomId,
            code,
          });
        }

        // console.log(code);
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      console.log("2nd useEffect");
      socketRef.current.on(Events.Code_Change, ({ code }) => {
        console.log(code);
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(Events.Code_Change);
    };
  }, [socketRef.current]);

  return (
    <>
      <textarea id="RTeditor"></textarea>
    </>
  );
};
