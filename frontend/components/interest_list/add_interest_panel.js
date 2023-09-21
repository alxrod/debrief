import { Fragment, useState, useEffect, useMemo } from 'react'
import { PencilIcon } from '@heroicons/react/outline'
import { Combobox, Dialog, Transition } from '@headlessui/react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import {getAllInterests, getFeed} from '../../reducers/summary/dispatchers/summary.get.dispatcher'
import {createInterest, joinInterest} from '../../reducers/summary/dispatchers/summary.interest.dispatcher'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AddInterestPanel = (props) => {
  const [query, setQuery] = useState('')
  const [interests, setInterests] = useState([])

  const addInterest = (interest) => {
    props.joinInterest(interest["unique_name"], props.user["_id"]).then(() => {
      props.getFeed(interest["_id"], interest["name"], 0, true)
      props.setOpen(false)
    })
  }

  useEffect(() => {
    if (props.open) {
      props.getAllInterests().then((new_interests) => {
        if (new_interests) {
          setInterests(new_interests)
        }
      })
    }
  }, [props.open])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      props.createInterest(query).then((new_interest) => {
        props.setOpen(false)
      })
    }
  }

  return (
    <Transition.Root show={props.open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as="div" className="relative z-10" onClose={props.setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={(feed) => (addInterest(feed))}>
                <div className="relative">
                  <PencilIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Tell me something you're interested in"
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={handleKeyDown}
                      enterKeyHint="done"
                    />
          
                </div>

                {query.length === 0 && (
                  <>
                  <Combobox.Label className="block text-sm text-gray-500 pt-5 pb-1 px-4">Other people are interested in...</Combobox.Label>
                  <Combobox.Options static className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                    {interests.map((interest) => (
                      <Combobox.Option
                        key={interest["_id"]}
                        value={interest}
                        className={({ active }) =>
                          classNames('cursor-default select-none px-4 py-2', active && 'bg-primary5 text-white')
                        }
                      >
                        {interest["query_content"]}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                  </>
                )}

                {/* {query !== '' && filteredFeeds.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">No existing interests.</p>
                )} */}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  joinInterest,
  getAllInterests,
  createInterest,
  getFeed
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddInterestPanel)