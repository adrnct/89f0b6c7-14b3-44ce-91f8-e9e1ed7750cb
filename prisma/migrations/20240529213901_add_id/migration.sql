/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");
