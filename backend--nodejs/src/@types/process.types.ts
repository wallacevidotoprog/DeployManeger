import {StatusDeployment}  from "@prisma/client";

export type ProcessModel = {
    id: number,
    name: string,
    status: StatusDeployment,
    cpu: number,
    memory: number,
}
