import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import {changeInterestPrivate} from "../../reducers/user/dispatchers/user.dispatcher"


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PrivateToggle = (props) => {
  const [enabled, setEnabled] = useState(false)

  const switchStatus = (status) => {
    props.changeInterestPrivate(props.feed.id, status).then(() => {
      setEnabled(status)
    })
  }

  useEffect(() => {
    setEnabled(props.feed.private)
  }, [props.feed.private])


  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={switchStatus}
        className={classNames(
          enabled ? 'bg-primary5' : 'bg-gray-200',
          'relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary5 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-4' : 'translate-x-0',
            'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3 text-xs">
        <span className="font-medium text-gray-900">{enabled ? "Private" : "Public"}</span>
      </Switch.Label>
    </Switch.Group>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
  feedsChanged: user.feedsChanged
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeInterestPrivate
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateToggle)