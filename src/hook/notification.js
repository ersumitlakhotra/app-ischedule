import { useState } from "react";

export function useManualNotification() {
    const [showNotification,setShowNotification] = useState(0)
    
    return {
        showNotification,
         setShowNotification
    }
}