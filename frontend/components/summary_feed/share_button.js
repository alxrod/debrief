import { Fragment, useEffect, useState, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { ShareIcon} from '@heroicons/react/outline'
import { usePathname } from 'next/navigation'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { Tooltip } from 'flowbite-react';

const ShareButton = (props) => {
  
  const pathname = usePathname()

  const copyLink = useMemo(() => {
    return process.env.NEXT_PUBLIC_FRONTEND_URL + "/feed/" + pathname.split("/").pop()
  }, [pathname])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyLink)
  }
  
  return (
    <Tooltip
      content="Copied Link to Clipboard"
      style="light"
      placement="bottom"
      trigger="click"
    >
      <button className='flex text-gray-400 hover:text-primary5 items-center text-sm' onClick={copyToClipboard}>
        Share<ShareIcon className="w-5 h-5 ml-1 "/>
      </button>
    </Tooltip>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  feedName: summary.feedName,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareButton)