import React from 'react'
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb'

const Caret = (direction: any) => {
    if (direction === 'desc') {
        return <TbTriangleFilled />
    } else {
        return <TbTriangleInvertedFilled />
    }
}

export default Caret
