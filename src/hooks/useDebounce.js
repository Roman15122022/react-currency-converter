import React, {useCallback, useRef} from "react";
export const useDebounce = (callback, delay) => {
    const timer = useRef(null);

    const debounceCallback = useCallback((...arg) =>{
        if (timer.current){
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() =>{
            callback(...arg);
        },delay)
    },[callback,delay])

    return debounceCallback;
}
