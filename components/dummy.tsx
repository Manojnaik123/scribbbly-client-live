'use client'

import socket from "@/lib/socket/socket";
import { TIMER_TICK } from "@shared/socket-names";
import { useEffect, useState } from "react";

const Dummy = () => {
    const [data, setData] = useState<number | string | null>(null)
    
    useEffect(() => {

        const handleTimerTick = (
            timer: number | string
        ) => {
            setData(timer)
        }

        socket.on(TIMER_TICK, handleTimerTick)

        return () => {
            socket.off(
                TIMER_TICK,
                handleTimerTick
            )
        }

    }, [])

    return (
        <div className='h-10 w-10 bg-red text-blue-500'>
            {data}
        </div>
    )
}

export default Dummy