import { useContext, useEffect } from "react";
import {InteractTrackerContext} from "./index";

function ButtonTracker(props) {
  const {
    buttonMap,
    setButtonMap,
  } = useContext(InteractTrackerContext);

  useEffect(() => {
    if (!buttonMap[props.btnId]) {
      buttonMap[props.btnId] = {click: 0, hover: 0}
    }
    setButtonMap(buttonMap)
  }, [])

  const addHover = () => {
    if (buttonMap[props.btnId]) {
      buttonMap[props.btnId].hover += 1
    } else {
      buttonMap[props.btnId] = {click: 0, hover: 1}
    }
    setButtonMap(buttonMap)
  }

  const addClick = () => {
    if (buttonMap[props.btnId]) {
      buttonMap[props.btnId].click += 1
    } else {
      buttonMap[props.btnId] = {click: 1, hover: 0}
    }
    setButtonMap(buttonMap)
  }

  return (
    <div
      onClick={addClick}
      onMouseEnter={addHover}
      
      className="inline-block"
    >
      {props.children}
    </div>
  )
}

export default ButtonTracker