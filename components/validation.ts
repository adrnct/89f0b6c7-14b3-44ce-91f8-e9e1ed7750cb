import { IEmployees } from '@/utils/interface'
import React from 'react'

const Validation = (value: any): Record<string, string> => {
    let error: any = {}

    if (!value.firstName) {
        error.firstName = 'First Name is Required'
    }
    if (!value.lastName) {
        error.lastName = 'Last Name is Required'
    }
    if (!value.phone) {
        error.phone = 'Phone is Required'
    } else if (!/^\d+$/.test(value.phone)) {
        error.phone = 'Phone must contain only numbers'
    }
    if (!value.position) {
        error.position = 'Position is Required'
    }
    if (!value.email) {
        error.email = 'Phone is Required'
    } else if (!!/[*\s@]+@[*\s@]+.[*\s@]+/.test(value.email)) {
        error.email = 'Email is Invalid'
    }

    return error
}

export default Validation
