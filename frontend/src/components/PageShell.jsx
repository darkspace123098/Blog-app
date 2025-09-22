import React from 'react'
import { useNavigation } from 'react-router-dom'

const PageShell = ({ children }) => {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 rounded-full bg-white animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageShell



