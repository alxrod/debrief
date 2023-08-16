import {useState, useEffect, useMemo, useContext, createContext} from "react"
import {WindowMonitorContext} from "../summary_feed/window_monitor";
import { usePathname } from 'next/navigation'
import StatsService from "../../services/stats.service";

export const InteractTrackerContext = createContext()

const InteractTracker = (props) => {
  const [startTime, setStartTime] = useState(Date.now());
  const [offsetTime, setOffsetTime] = useState(0);

  const windowIsActive = useContext(WindowMonitorContext);

  const [buttonMap, setButtonMap] = useState({})
  const pathname = usePathname()

  useEffect(() => {
    if (windowIsActive) {
      setStartTime(Date.now())
    } else {
      setOffsetTime((Date.now() - startTime) + offsetTime)
    }
  }, [windowIsActive])

  useEffect(() => {
    window.onbeforeunload = finishVisit
    return () => {
      window.onbeforeunload = null
    }
  }, [startTime, offsetTime])
  
  const finishVisit = e => {
    const now = Date.now();
    const timeDifference = (now - startTime) + offsetTime;
    const data = {
      path: pathname,
      duration: timeDifference,
      button_activity: buttonMap
    }
    if (process.env.NEXT_PUBLIC_MODE === 'dev') {
      console.log("Would save visit data: ", data)
    } else {
      StatsService.saveVisit(data)
    }
    
  }

  return (
    <InteractTrackerContext.Provider value={{buttonMap, setButtonMap}}>
      {props.children}
    </InteractTrackerContext.Provider>
  )
}

export default InteractTracker