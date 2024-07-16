-- CreateTable
CREATE TABLE "UserAcess" (
    "id" SERIAL NOT NULL,
    "acessId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "UserAcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acess" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acess_name_key" ON "Acess"("name");

-- AddForeignKey
ALTER TABLE "UserAcess" ADD CONSTRAINT "UserAcess_acessId_fkey" FOREIGN KEY ("acessId") REFERENCES "Acess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAcess" ADD CONSTRAINT "UserAcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
