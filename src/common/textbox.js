const Textbox = ({ type, label, value, setValue, placeholder, isRequired = false, isDisable = false, footer = '',className='' }) => {
    return (
        <div class={`${isDisable ? 'text-gray-400' : 'text-gray-700'} `}>
            <label class="block mb-2 text-sm font-medium ">{label} {isRequired && <span class='text-red-500'>*</span>}</label>
            <input type={type} value={value} disabled={isDisable} style={{fontSize:16}}
                class={`bg-gray-50 border border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${className} ${isRequired && value==='' && 'border-red-600'}`}
                placeholder={placeholder} onChange={(e) => setValue(e.target.value)} />
            {footer !== '' &&
                <label class="block mb-2 text-xs ml-3 mt-1 ">{footer} </label>
            }
        </div>
    )
}

const TextboxFlex = ({ label, mandatory=false, input }) => {
    return (
        <div class='flex items-center w-full gap-2'>
            <p class="font-semibold w-32">{label} {mandatory &&<span class='text-red-600'>*</span>}</p>
            {input}
        </div>
    )
}

const TextboxFlexCol = ({ label, mandatory = false, input }) => {
    return (
        <div class='flex flex-col w-full gap-2'>
            <p class="font-medium text-sm w-32">{label} {mandatory && <span class='text-red-600'>*</span>}</p>
            {input}
        </div>
    )
}

export { Textbox, TextboxFlex, TextboxFlexCol }