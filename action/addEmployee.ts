const addNewEmployee = async (employeeData: any) => {
    try {
        const response = await fetch('/api/employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        })
        const newEmployee = await response.json()
        return newEmployee
    } catch (error) {
        console.error('error 1', error)
        throw error
    }
}

export default addNewEmployee
