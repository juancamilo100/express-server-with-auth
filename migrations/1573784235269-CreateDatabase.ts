import bcrypt from "bcryptjs";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1573784235269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE users (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "first_name" text,
                "last_name" text,
                "email" text NOT NULL,
                "password" text NOT NULL,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            INSERT INTO users (first_name, last_name, email, password)
            VALUES (
                'Default',
                'Admin',
                '${process.env.DEFAULT_ADMIN_USER_EMAIL}',
                '${bcrypt.hashSync(process.env.DEFAULT_ADMIN_USER_PASSWORD!)}'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE users;
        `);
    }
}
