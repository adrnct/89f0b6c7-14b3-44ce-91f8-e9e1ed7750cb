import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const data = await request.json()
        const { firstName, lastName, position, phone, email } = data
        const id = parseInt(context.params.id)
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                firstName,
                lastName,
                position,
                phone,
                email,
            },
        })
        return NextResponse.json(updatedEmployee)
    } catch (error) {
        console.error('Error Update Employee: ', error)
        return NextResponse.error()
    }
}
