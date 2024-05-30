'use client'
import { FaPlus } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'
import { IEmployees } from '@/utils/interface'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import addNewEmployee from '@/action/addEmployee'
import Headers from '@/utils/const'
import Caret from './Caret'
// import Validation from './Validation'

const EmployeeTable = (): React.ReactNode => {
    const [employees, setEmployees] = useState<IEmployees[]>([])
    const [initialEmployees, setInitialEmployees] = useState<IEmployees[]>([])
    const [sort, setSort] = useState({ keyToSort: 'id', direction: 'asc' })
    const [changedFields, setChangedFields] = useState<{ [id: number]: Partial<IEmployees> }>({})
    const [errors, setErrors] = useState({})
    const [value, setValue] = useState({ firstName: '', lastName: '', position: '', phone: '', email: '' })
    // const handleInput = (e: { preventDefault: () => void }) => {
    //     e.preventDefault()
    //     setErrors(Validation(value))
    // }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/api/employee', {
                    headers: {
                        Accept: 'application/json',
                        method: 'GET',
                    },
                })
                const employeeData = await response.json()
                setEmployees(employeeData)
                setInitialEmployees(employeeData)
            } catch (error) {
                console.error('Error fetching employees:', error)
            }
        }
        fetchEmployees()
    }, [])

    //EDIT IN TABLE
    const handleInputChange = (id: number, field: keyof IEmployees, value: string) => {
        const updatedEmployee = employees.map((employee) => {
            if (employee.id === id) {
                return { ...employee, [field]: value }
            }
            return employee
        })
        setEmployees(updatedEmployee)

        setChangedFields((prevChangedFields) => ({
            ...prevChangedFields,
            [id]: {
                ...prevChangedFields[id],
                [field]: value,
            },
        }))
    }

    //ADD BUTTON
    const addNewRow = () => {
        let newId = employees.length
        newId += 1
        setEmployees((prevEmployees) => {
            const newEmployee: IEmployees = {
                id: newId,
                firstName: '',
                lastName: '',
                position: '',
                phone: '',
                email: '',
            }
            return [newEmployee, ...prevEmployees]
        })
    }

    //COMPARE FUNCTION
    const isDataChanged = (initial: IEmployees[], current: IEmployees[]) => {
        return JSON.stringify(initial) !== JSON.stringify(current)
    }

    //SAVE BUTTON
    const save = async () => {
        if (initialEmployees < employees) {
            const newData = employees.filter((employee) => employee.id > initialEmployees.length)
            const sanitizedData = newData.map(({ id, ...rest }) => rest)
            try {
                const newEmployee = await addNewEmployee(sanitizedData)
                setEmployees((prevEmployees) => [newEmployee, ...prevEmployees])
            } catch (error) {
                console.log('failed to POST data')
            }
        }
        if (isDataChanged(initialEmployees, employees)) {
            const updatePromises = Object.keys(changedFields).map(async (id) => {
                const response = await fetch(`/api/employee/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(changedFields[parseInt(id)]),
                })
                return response.json()
            })

            try {
                await Promise.all(updatePromises)
                setChangedFields({})
                setInitialEmployees(employees)
            } catch (error) {
                console.log('failed to PUT data')
            }
        }
    }

    //SORTING
    const handleHeaderClick = (header: any) => {
        setSort({
            keyToSort: header.key,
            direction: header.key === sort.keyToSort ? (sort.direction === 'asc' ? 'desc' : 'asc') : 'desc',
        })
    }
    const getSortedArray = (arrayToSort: any[]) => {
        if (sort.direction === 'asc') {
            return arrayToSort.sort((a, b) => (a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1))
        }
        return arrayToSort.sort((a, b) => (a[sort.keyToSort] > b[sort.keyToSort] ? -1 : 1))
    }
    return (
        <div>
            <div className='flex gap-3 justify-end mb-5 mt-20'>
                <button onClick={addNewRow}>
                    <FaPlus size={25} />
                </button>
                <button onClick={save}>
                    <FaSave size={25} />
                </button>
            </div>
            <Table aria-label='employee-list'>
                <TableHeader>
                    {Headers.map((header, index) => (
                        <TableColumn key={index} onClick={() => handleHeaderClick(header)}>
                            <div className='flex gap-3 justify-between'>
                                {header.label}

                                {header.key === sort.keyToSort && <Caret direction={sort.keyToSort === header.key ? sort.direction : 'asc'} />}
                            </div>
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody emptyContent={'No rows to display.'}>
                    {getSortedArray(employees).map((employee: IEmployees, index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                <input value={employee.firstName ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(employee.id, 'firstName', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <input value={employee.lastName ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(employee.id, 'lastName', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <input value={employee.position ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(employee.id, 'position', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <input value={employee.phone ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(employee.id, 'phone', e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <input value={employee.email ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(employee.id, 'email', e.target.value)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default EmployeeTable
