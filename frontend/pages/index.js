import React, {useState} from 'react';
import TestService from "../services/test.service";

const LandingPage = (props) => {
  const [message, setMessage] = useState("")
  const [textColor, setTextColor] = useState("text-green")

  const onClick = () => {
    TestService.ping().then((resp) => {
      setTextColor("text-green")
      setMessage(resp)
    }).catch((err) => {
      setTextColor("text-red")
      setMessage(err)
    })
  }
  return (
    
    <div>
      <div>
        <div className="relative px-6 lg:px-8 flex justify-center">
            <div className="max-w-6xl flex flex-col-reverse items-center lg:items-start lg:flex-row pt-10 sm:pt-20 pb-32 sm:pb-40">
              <div>
                <div className="max-w-md lg:mt-10">
                  <h1 className="text-4xl font-bree-serif tracking-tight text-center sm:text-left sm:text-6xl">
                    Alex Rodriguez's Boilerplate Web Stack
                  </h1>
                  <div className="p-4 flex flex-col items-center">
                    <h3 className={textColor}>{message}</h3>
                    <br></br>
                    <button className="bg-primary5 text-center mx-auto px-2 py-1 text-white rounded-md" onClick={onClick}>Try talking to the backend</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

    </div>
  )
}
export default LandingPage