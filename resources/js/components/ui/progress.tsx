import { cn } from "@/lib/utils"
import React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>{
    value? : number,
    max? : number
}

const Progress = ({className,value=0,max=100,...props}: ProgressProps) => {
    const persentage = Math.min(Math.max((value/max)*100,0),0)
  return (
    <div className={
        cn(
            "relative h-2 w-full overflow-hidden,rounded-full bg-primary-100",
            className
        )} {...props}>

            <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full" style={{width:`${persentage}`}}></div>
        </div>
  )
}

export default Progress
