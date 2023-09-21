import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SearchIcon, ChevronDownIcon } from '@heroicons/react/solid'

const queries = [
  {
    id: 1,
    query: 'Joe Jonas and Sophia Turner Divorce',
    name: "JoeJonasandSophiaTurnerDivorce"
  },
  {
    id: 2,
    query: 'Libya Natural Disasters',
    name: "LibyaNaturalDisasters"

  },
  {
    id: 3,
    query: 'Efforts to curb inflation in American economy',
    name: "EffortstocurbinflationinAmericaneconomy"
  },
  {
    id: 4,
    query: "The Guardian",
    name: "theguardian"
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example(props) {
  const [selected, setSelected] = useState(queries[0])
  useEffect(() => {
    console.log("SETTING TO", selected.name)
    props.setFeedName(selected.name)
  },[selected])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 w-full">I want to learn about...</Listbox.Label>
          <div className="relative mt-2 w-full">
            <Listbox.Button className="flex relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary5 sm:text-sm sm:leading-6">
              <SearchIcon className="text-gray-400 w-6 h-6"/>
              <span
                className={classNames('font-semibold ml-2 block truncate')}
              >
                {selected.query}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {queries.map((query) => (
                  <Listbox.Option
                    key={query.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-primary5 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={query}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {query.query}
                          </span>
                        </div>

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
                      </>
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
