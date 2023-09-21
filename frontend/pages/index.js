import React, {useState, useEffect} from 'react';
import Image from 'next/image'

import { MailIcon, BookOpenIcon, CloudIcon, VolumeUpIcon } from '@heroicons/react/solid'
import SummaryFeed from "../components/summary_feed"


import MainImage from '../public/landing_page/main_image.png';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router'
import InteractTracker from '../components/interaction_tracker';
import WindowMonitor from '../components/summary_feed/window_monitor';
import ButtonTracker from '../components/interaction_tracker/button_tracker'


import InterestPicker from "../components/landing_page/interest_picker";

const timeline = [
  {
    id: 1,
    content: "You tell us what you're interested in and we generate articles",
    href: '#',
    icon: CloudIcon,
    iconBackground: 'bg-primary5',
  },
  {
    id: 2,
    content: 'You can subscribe to your favorite news sources',
    href: '#',
    icon: BookOpenIcon,
    iconBackground: 'bg-primary5',
  },
  {
    id: 3,
    content: 'You can save an article for later by emailing it to debrief.later@gmail.com',
    href: '#',
    icon: MailIcon,
    iconBackground: 'bg-primary5',
  },

  {
    id: 4,
    content: 'Then we summarize it all and read it to you anywhere and anytime',
    href: '#',
    icon: VolumeUpIcon,
    iconBackground: 'bg-primary6',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



const LandingPage = (props) => {

  const [feedName, setFeedName] = useState("")

  const router = useRouter()
  useEffect(() => {
    if (props.isLoggedIn) {
      router.push("/home")
    }
  },[props.isLoggedIn])
  return (
    <WindowMonitor>
      <InteractTracker>
        <div>
          <div className="relative px-8 flex justify-center">
            <div className="max-w-6xl flex flex-col items-center lg:flex-row pt-10 sm:pt-20 pb-32 sm:pb-40">
              <div>
                <div className="max-w-md lg:mb-10">
                  <h1 className="text-4xl font-bree-serif tracking-tight text-left sm:text-6xl">
                    Sit back and <b className="text-primary6">listen</b>
                  </h1>
                  <div className="mt-8 flex-wrap justify-center sm:justify-start">
                    <p className="text-gray-600 mb-5">Debrief turns hundreds of pages into a single spoken summary. Stay up to date on your industry whenever and wherever you are. </p>
                    {props.isLoggedIn ? (
                      <a
                        href="/home"
                        className="inline-block rounded-lg bg-primary5 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-primary5 hover:bg-primary6 hover:ring-primary6"
                      >
                        Go to your feed{' '}
                        <span className="text-indigo-200" aria-hidden="true">
                          &rarr;
                        </span>
                      </a>
                    ) : (
                      <ButtonTracker btnId={"landing-page-get-started"}>
                        <a
                          href="/register"
                          className="inline-block rounded-lg bg-primary5 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-primary5 hover:bg-primary6 hover:ring-primary6"
                        >
                          Get started{' '}
                          <span className="text-indigo-200" aria-hidden="true">
                            &rarr;
                          </span>
                        </a>
                      </ButtonTracker>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden lg:inline lg:w-[25vw] ">
                <Image
                    src={MainImage}
                    alt="Product screenshot"
                    className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="h-[10vh]"/> */}

        <div className="relative bg-primary6 flex justify-center">
          <div className="max-w-xl flex flex-col items-start pt-10 sm:pt-20 pb-32 sm:pb-40 px-8">
            <h1 className="text-4xl font-bree-serif tracking-tight text-left sm:text-6xl text-white">
              How's it work?
            </h1>
            <p className="text-sm text-white text-xl font-medium py-2 max-w-sm">
              We pull together your favorite articles on the internet in three main ways
            </p>
            <br/>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              event.iconBackground,
                              'h-8 w-8 rounded-full mt-1 flex items-center justify-center ring-8 ring-white'
                            )}
                          >
                            <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 py-1.5 ">
                          <div className="pl-5">
                            <p className="text-sm text-white text-xl font-medium">
                              {event.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>




        <div className="relative flex justify-center ">
          <div className=" flex flex-col items-start pt-10 sm:pt-20 pb-32 sm:pb-40 px-8">
            <div className="grid lg:grid-cols-2 gap-x-24">
              <div className="lg:mt-24">
                <h1 className="text-4xl font-bree-serif tracking-tight text-left sm:text-6xl text-primary7">
                  Let's try it out!
                </h1>
                <p className="text-sm text-gray-700 text-xl py-2 max-w-sm">
                  The best way to use debrief is generating your own areas of interest. Check out a couple users have already come up with.
                </p>
                <br/>
                <InterestPicker setFeedName={setFeedName}/>
                <br/>
                <ButtonTracker btnId={"landing-page-try-yourself"}>
                  <a
                    href="/register"
                    className="inline-block rounded-lg bg-primary5 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-primary5 hover:bg-primary6 hover:ring-primary6"
                  >
                    Try it yourself!{' '}
                    <span className="text-indigo-200" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                </ButtonTracker>
              </div>
              <div className="">
                {process.env.NEXT_PUBLIC_MODE !== 'dev' && (
                  <SummaryFeed feedName={feedName} previewMode={true}/>
                )}
              </div>
            </div>
          </div>
        </div>

       
      </InteractTracker>
    </WindowMonitor>
  )
}
const mapStateToProps = ({ user }) => ({
  isLoggedIn: user.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage)
