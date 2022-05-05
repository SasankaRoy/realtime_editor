import React, { useState, useRef, useEffect } from "react";
import { Client } from "./Client";
import { Editor } from "./Editor";
import { initSocket } from "../socket";
import Events from "../Events";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

export const Editorpage = () => {
  const reactNavigator = useNavigate();
  const location = useLocation();
  const prams = useParams();
  const roomId = prams.roomId;

  const [connect1, setconnect1] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_err", (err) => handleError(err));
      socketRef.current.on("connect_faild", (err) => handleError(err));
      function handleError(E) {
        console.log("socket erron", E);
        toast.error("Socket connection failed , try again later");
        reactNavigator("/");
      }
      socketRef.current.emit(Events.Join, {
        roomId,
        username: location.state?.input2,
      });

      //listening for joined event
      socketRef.current.on(Events.Joined, ({ client, username, socketId }) => {
        if (username !== location.state.input2) {
          toast.success(`${username} has joined the room`);
          console.log(`${username} has joined the room`);
        }
        setconnect1(client);
        socketRef.current.emit(Events.Sync_Code,{
          code:codeRef.current,
          socketId
        })
      });

      // lisning for disconnect

      socketRef.current.on(Events.Disconnected, ({ username, socketId }) => {
        toast.success(`${username} disconnected`);
        setconnect1((pre) => {
          return pre.filter((connect1) => connect1.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.off(Events.Disconnected);
      socketRef.current.off(Events.Join);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    <Navigate to="/" />;
  }

  // copyId here...

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId copied successfully");
    } catch (error) {
      toast.error("Con't Copy RoomID");
      console.error(error);
    }
  };

  const leaveRoom = () => {
    return reactNavigator("/");
  };

  return (
    <>
      <div className="mainWrap">
        <div className="leftSide">
          <div className="sideInner">
            <div className="logo">
              <h2 className="logo_h2">
                real-time <span className="logoName">code editor</span>
              </h2>
            </div>
            <h3 className="conn_h3">connected</h3>
            <div className="connected_list">
              {connect1.map((client) => (
                <Client key={client.stockeId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn btn_copy" onClick={copyId}>
            copy Room ID
          </button>
          <button className="btn btn_leave" onClick={leaveRoom}>
            Leave
          </button>
        </div>

        <div className="editor">
          <Editor socketRef={socketRef} roomId={roomId} getCode={(code)=>{
            codeRef.current = code;
          }} />
        </div>
      </div>
    </>
  );
};
