 const AppCard = ({children}) => {
    return (
        <div className="w-full rounded-lg bg-white shadow sm:max-w-xl md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        {children}
        </div>
    )
    }

export default AppCard;