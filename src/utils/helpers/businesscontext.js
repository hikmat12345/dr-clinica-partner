import React from 'react'

const BusinessContext = React.createContext()

export const BusinessProvider = BusinessContext.Provider
export const BusinessConsumer = BusinessContext.Consumer

export default BusinessContext
