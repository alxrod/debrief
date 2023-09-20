import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { ClockIcon} from '@heroicons/react/outline'

import { changePlaybackSpeed } from '../../reducers/user/dispatchers/user.dispatcher';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

const speeds = [
  { id: 1, name: '0.50x' },
  { id: 2, name: '1.00x' },
  { id: 3, name: '1.25x' },
  { id: 4, name: '1.50x' },
  { id: 5, name: '2.00x' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PlaybackButton = (props) => {
  const [selected, setSelected] = useState(speeds[1])
  const [hasChanged, setHasChanged] = useState(false)

  useEffect(() => {
    console.log("Setting val for speed ", props.user.playback_speed)
    for (let i = 0; i < speeds.length; i++) {
      if (parseFloat(speeds[i].name) == props.user.playback_speed) {
        setSelected(speeds[i])
        console.log("found and setting: ", speeds[i])
      }
    }
  }, [props.user.playback_speed])

  useEffect(() => {
    if (selected.name != "1.00x") {
      setHasChanged(true)
    }
    if (hasChanged || selected.name != "1.00x") {
      if (parseFloat(selected.name) !== props.user.playback_speed && props.user.playback_speed) {
        props.changePlaybackSpeed(parseFloat(selected.name))
      }
    }
  }, [selected])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button>
              <ClockIcon className={(props.size ? ("h-"+props.size+" w-"+props.size) : "h-8 w-8 ") + " text-gray-500"} aria-hidden="true" />
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-22 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {speeds.map((speed) => (
                  <Listbox.Option
                    key={speed.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-primary5 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={speed}
                  >
                    {({ selected, active }) => (
                      <div>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                         {speed.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-primary5',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changePlaybackSpeed
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaybackButton)