import React, {useState, useEffect} from 'react';
import Image from 'next/image'

import { MailIcon, VolumeUpIcon, CloudIcon } from '@heroicons/react/solid'


import MainImage from '../public/landing_page/main_image.png';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router'

const timeline = [
  {
    id: 1,
    content: 'Email articles to debrief.later@gmail.com',
    href: '#',
    icon: MailIcon,
    iconBackground: 'bg-primary4',
  },
  {
    id: 2,
    content: 'Debrief scrapes articles and generates summaries',
    href: '#',
    icon: CloudIcon,
    iconBackground: 'bg-primary5',
  },
  {
    id: 3,
    content: 'Listen to articles and save the ones you want to read for later',
    href: '#',
    icon: VolumeUpIcon,
    iconBackground: 'bg-primary6',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



const LandingPage = (props) => {

  const router = useRouter()
  useEffect(() => {
    if (props.isLoggedIn) {
      router.push("/feed")
    }
  },[props.isLoggedIn])
  return (
    
    <div>
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
                      href="/feed"
                      className="inline-block rounded-lg bg-primary5 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-primary5 hover:bg-primary6 hover:ring-primary6"
                    >
                      Go to your feed{' '}
                      <span className="text-indigo-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  ) : (
                    <a
                      href="/register"
                      className="inline-block rounded-lg bg-primary5 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-primary5 hover:bg-primary6 hover:ring-primary6"
                    >
                      Get started{' '}
                      <span className="text-indigo-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
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
    </div>
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
