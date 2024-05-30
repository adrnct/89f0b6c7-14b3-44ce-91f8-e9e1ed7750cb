import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const employees = await prisma.employee.findMany()
        return NextResponse.json(employees)
    } catch (error) {
        console.log('error fetching employees : ', error)
        return NextResponse.error()
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        if (Array.isArray(data)) {
            const newEmployees = await prisma.employee.createMany({
                data,
            })
            return NextResponse.json(newEmployees)
        } else {
            const { firstName, lastName, position, phone, email } = data
            const newEmployee = await prisma.employee.create({
                data: {
                    firstName,
                    lastName,
                    position,
                    phone,
                    email,
                },
            })
            return NextResponse.json(newEmployee)
        }
    } catch (error) {
        console.error('Error Add New Employee: ', error)
        return NextResponse.error()
    }
}
