import { INestApplication } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Connection } from "typeorm";


export const loadFixtures = async (
    connection: Connection, sqlFileName: string
  ) => {
    const sql = fs.readFileSync(
      path.join(__dirname, 'fixtures', sqlFileName),
      'utf8'
    );
  
    const queryRunner = connection.driver.createQueryRunner('master');
  
    for (const c of sql.split(';')) {
      await queryRunner.query(c);
    }
  }