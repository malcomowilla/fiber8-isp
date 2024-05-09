
import {createContext} from 'react'


import ActionCable from "actioncable";

const CableProvider = ({children}) => {
    const cableUrl = 'ws://localhost:3000/cable'
    const CableApp = {}

    CableApp.cable = ActionCable.createConsumer(cableUrl)

                return  <CableContext.Provider value={CableApp}>{children}</CableContext.Provider>

}

export const CableContext = createContext()
export {CableProvider}