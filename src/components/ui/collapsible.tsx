
import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
  children?: React.ReactNode | ((props: { open: boolean }) => React.ReactNode)
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <CollapsiblePrimitive.CollapsibleTrigger 
      ref={ref} 
      {...props}
      onPointerDown={(e) => {
        props.onPointerDown?.(e)
        setOpen(!open)
      }}
    >
      {typeof children === "function" 
        ? (children as (props: { open: boolean }) => React.ReactNode)({ open }) 
        : children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
