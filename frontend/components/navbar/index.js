/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import { bindActionCreators } from 'redux'
import { logout } from "../../reducers/user/dispatchers/user.dispatcher";
import { connect } from "react-redux";

import { useRouter } from 'next/router'
import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavBar = (props) => {
  const router = useRouter()
  
  return (
    <Disclosure as="nav" className={"bg-secondary1 shadow"}>
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => router.push("/")}>
                  <h1 className="font-medium">Boiler</h1>
                </div>
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
                   <button
                   href="#"
                   onClick={() => {
                     props.logout()
                   }}
                   className='text-sm text-gray-700'>
                   Log out
                  </button>
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
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
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