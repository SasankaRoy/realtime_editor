import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import toast from "react-hot-toast";

export const Home = () => {
  const [input1, setinput1] = useState("");
  const [input2, setinput2] = useState("");
  const navigate = useNavigate();
  // 1ft inputvalue
  const inputval1 = (event) => {
    event.preventDefault();
    let value = event.target.value;
    setinput1(value);
  };
  // 2nd inputvalue
  const inputval2 = (event) => {
    event.preventDefault();
    let value = event.target.value;
    setinput2(value);
  };
  // genrating uniqueId here...
  const newRoom = (e) => {
    e.preventDefault();
    const uniqueId = uuid4();
    setinput1(uniqueId);
    toast.success("A New Room created");
  };

  // joining new room here...

  const joinRoom = () => {
    if (!input1 || !input2) {
      toast.error("Please enter the details");
    } else {
      navigate(`/editor/${input1}`, {
        state: {
          input2,
        },
      });
    }
  };

  //  joining new room with "enter key" here...
  const keyUp = (event) => {
    // console.log(event.code)
    if (event.code == "Enter") {
      joinRoom();
    }
  };
  return (
    <>
      <div className="homePage">
        <div className="fromWrapper">
          <h2 className="logo">
            real-time <span className="logoName">code editor</span>
          </h2>
          <h4 className="lable">Enter invitation room id.</h4>
          <div className="ints_here">
            <input
              type="text"
              name="userId"
              value={input1}
              onChange={inputval1}
              placeholder="room id"
              className="input_box"
              onKeyDown={keyUp}
            />
            <input
              type="text"
              name="username"
              value={input2}
              onChange={inputval2}
              placeholder="user name"
              className="input_box"
              onKeyDown={keyUp}
            />
            <button className="btn btn_1" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              It you don't have an invitation then create &nbsp;
              <a href="/" onClick={newRoom} className="createNew">
                new Room.
              </a>
            </span>
          </div>
        </div>
        <footer>
          <h4 className="footer">
            build with 💛&nbsp;
            <span className="name"> sasanka roy .</span>
          </h4>
        </footer>
      </div>
    </>
  );
};
