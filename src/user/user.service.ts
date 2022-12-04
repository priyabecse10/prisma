import { Injectable } from '@nestjs/common';
import { SALT_ROUNDS } from 'src/config/constants';
import { PrismaService } from 'src/config/database';
import * as bcrypt from 'bcrypt';
import { UserSignupBodyParams } from 'src/entities/session/session-request.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private prisma:PrismaService
    ){}

    async signupUser(userAttributes:UserSignupBodyParams){
        const currentDate=new Date();
        const userCreateAttributes=(
            name:string,
            role:string,
            email:string,
            password:string,
            created_at:Date,
            updated_at:Date
        )=>{
            return Prisma.validator<Prisma.UserCreateInput>()({
                name,
                role,
                email,
                password,
                created_at,
                updated_at
           })
        };
        const createdUser=await this.prisma.user.create({
            data:userCreateAttributes(
                userAttributes.name,
                userAttributes.role,
                userAttributes.email,
                await bcrypt.hash(userAttributes.password,SALT_ROUNDS),
                currentDate,
                currentDate
            ),
            });
            return createdUser;
        
    }
}
