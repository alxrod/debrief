/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon, ArrowLeftIcon, ExclamationCircle } from '@heroicons/react/outline'

import { bindActionCreators } from 'redux'
import { logout } from "../../reducers/user/dispatchers/user.dispatcher";
import { connect } from "react-redux";

import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavBar = (props) => {
  const router = useRouter()
  const pathname = usePathname()
  const [onFeed, setOnFeed] = useState(false)

  useEffect(() => {
    if (pathname.includes("/feed/")) {
      setOnFeed(true)
    } else {
      setOnFeed(false)
    }
  }, [pathname])
  
  return (
    <Disclosure as="nav" className={"bg-secondary1 shadow"}>
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {onFeed ? (
                  <a className="flex-shrink-0 flex items-center cursor-pointer text-gray-400 hover:text-primary5" href={props.isLoggedIn ? "/home" : "/"}>
                    <ArrowLeftIcon className="w-5 h-5 mr-2"/>
                    <h1 className="font-medium">Back</h1>
                  </a>
                ) : (
                  <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => router.push(props.isLoggedIn ? "/home" : "/")}>
                    <h1 className="font-medium">Debrief</h1>
                  </div>
                )}
                
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-primary4 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {props.isLoggedIn && (
                  <>
                  </>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">

                {/* Profile dropdown */}
                {props.isLoggedIn ? (
                  <div className="flex px-1 pt-1 font-medium space-x-4">
                    <Link
                      href="/home"
                      className='text-sm text-gray-700 hover:text-gray-900'
                    >
                      My Feed
                    </Link>
                    <button
                      href="#"
                      onClick={() => {
                        props.logout()
                        // router.push("/")
                      }}
                      className='text-sm text-gray-700 hover:text-gray-900'
                    >
                      Log out
                    </button>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScoGRICJR18nk2CmdaCIP61iO5DYlS_H-eOrHCc8xEDSbTDOQ/viewform?usp=sf_link"
                      target="_blank"
                      className='text-sm text-gray-700 hover:text-gray-900'
                    >
                      Report bug
                    </a>
                 </div>
                ) : (
                  <div className="flex px-1 pt-1 font-medium space-x-4">
                      <Link
                        href="/login"
                        className={classNames('text-primary4 hover:text-primary5 inline-flex items-center')}
                      >
                        Log in
                      </Link>
  
                      <Link
                        href="/register"
                        className={classNames('text-gray-700 hover:text-gray-900 inline-flex items-center')}
                      >
                        Sign up
                      </Link>

                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScoGRICJR18nk2CmdaCIP61iO5DYlS_H-eOrHCc8xEDSbTDOQ/viewform?usp=sf_link"
                        target="_blank"
                        className={classNames('text-gray-700 hover:text-gray-900 inline-flex items-center')}
                      >
                        Report bug
                      </a>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScoGRICJR18nk2CmdaCIP61iO5DYlS_H-eOrHCc8xEDSbTDOQ/viewform?usp=sf_link"
                  target="_blank"
                  className={classNames('text-gray-700 hover:text-gray-900 text-sm font-medium mr-3 inline-flex items-center')}
                >
                  Report bug
                </a>
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary4">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          
          <Disclosure.Panel className="sm:hidden">
            {props.isLoggedIn && (
            <div className="pt-2 pb-3 space-y-1">
              {/* Current: "bg-indigo-50 border-primary4 text-primary6", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
            </div>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="mt-3 space-y-1">
              {!props.isLoggedIn && (
                <>
                  <Disclosure.Button
                    as="a"
                    href="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {({ active }) => (
                      <Link
                        href="/login"
                        className={classNames(active ? 'bg-gray-100' : '', 'text-sm text-gray-700')}
                      >
                        Log in
                      </Link>
                    )}
                  </Disclosure.Button>

                  <Disclosure.Button
                    as="a"
                    href="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {({ active }) => (
                      <Link
                        href="/register"
                        className={classNames(active ? 'bg-gray-100' : '', 'text-sm text-gray-700')}
                      >
                        Sign up
                      </Link>
                    )}
                  </Disclosure.Button>
                </>
              )}
              {props.isLoggedIn && (
              <Disclosure.Button
                as="a"
                href="#"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {({ active }) => (
                  <button
                    href="#"
                    onClick={() => {
                      props.logout()
                      // router.push("/")
                    }}
                    className={classNames(active ? 'bg-gray-100' : '', 'text-sm text-gray-700')}
                  >
                    Log out
                  </button>
                )}
              </Disclosure.Button>
              )}
              </div>
            </div>
          </Disclosure.Panel>
          
        </>
      )}
      
    </Disclosure>
  )
}

const mapStateToProps = ({ user }) => ({
  isLoggedIn: user.isLoggedIn,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  logout,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar)