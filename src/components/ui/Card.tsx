interface CardProps {
    header?: React.ReactNode,
    subheader?: React.ReactNode
    children?: React.ReactNode,
    footer?: React.ReactNode,
    classname?: string,
}

export default function Card({header, subheader, children, footer, classname}: CardProps){
    return(
      <div className={`flex flex-col w-full h-full border-(--color-border-default) border rounded-xl p-6 ${classname}`}>
        {header && (
          <div className="flex flex-col w-full h-fit font-normal font-semibold text-xl">
            <p>{header}</p>
            <p className="font-mono text-sm font-light my-1 text-(--color-text-secondary)">{subheader}</p>
          </div>
        )}

        {children && 
          <div className="flex flex-col w-full h-auto">
            {children}
          </div>  
        }

        {}
        <hr className="border border-(--color-border-subtle) my-2"/>
      </div>
    )
}