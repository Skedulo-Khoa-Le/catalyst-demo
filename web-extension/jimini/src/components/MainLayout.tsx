import React from 'react'

const className = 'cx-bg-white cx-pt-4 cx-pb-4 cx-pl-5 cx-pr-12 cx-h-full cx-shadow-xs cx-overflow-y-overlay'

const MainLayout: React.FC<React.PropsWithChildren<any>> = (props) => {
  return <div className={className}>{props.children}</div>
}

export default MainLayout
