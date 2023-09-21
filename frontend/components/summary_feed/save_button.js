import { Fragment, useEffect, useState, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { PlusIcon} from '@heroicons/react/outline'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { Tooltip } from 'flowbite-react';
import { usePathname } from 'next/navigation';

import {joinInterest} from '../../reducers/summary/dispatchers/summary.interest.dispatcher'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ShareButton = (props) => {

  const pathname = usePathname()
  const [alreadyOwn, setAlreadyOwn] = useState(false)

  const name = useMemo(() => {
    return pathname.split("/").pop()
  }, [pathname])

  useEffect(() => {
    if (props.user?.feeds) {
      for (let i = 0; i < props.user.feeds.length; i++) {
        if (props.user.feeds[i].name.toLowerCase() === name || props.user.feeds[i]?.unique_name === name) {
          setAlreadyOwn(true) 
        }
      }
    }
  }, [props.user?.feeds])

  const joinInterest = () => {
    props.joinInterest(name)
  }

  
  return (
    <>
    {!alreadyOwn && (
      <>
      {props.anonymous ? (

        <Tooltip
          content={"Sign up to save feeds"}
          style="light"
          placement="bottom"
          trigger="hover"
        >
          <button onClick={joinInterest} disabled={props.anonymous} className='flex text-gray-400 hover:enabled:text-primary5 items-center text-sm'>
            Save Feed<PlusIcon className="w-5 h-5 ml-1 "/>
          </button>
        </Tooltip>
      ) : (
        <button onClick={joinInterest} disabled={props.anonymous} className='flex text-gray-400 hover:enabled:text-primary5 items-center text-sm'>
          Save Feed<PlusIcon className="w-5 h-5 ml-1 "/>
        </button>
      )}
      </>
    )}
    </>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  anonymous: user.anonymousUser,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  joinInterest
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareButton)