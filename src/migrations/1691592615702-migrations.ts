import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1691592615702 implements MigrationInterface {
  name = 'Migrations1691592615702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mvd"."ticket" ("id" SERIAL NOT NULL, "ticket_id" integer NOT NULL, "status" character varying NOT NULL, "departureCity" character varying NOT NULL, "arrivalCity" character varying NOT NULL, "departureStation" character varying NOT NULL, "arrivalStation" character varying NOT NULL, "departureCoodrs" character varying NOT NULL, "arrivalCoodrs" character varying NOT NULL, "departureAt" character varying NOT NULL, "arrivalAt" character varying NOT NULL, "routePath" character varying NOT NULL, "carName" character varying NOT NULL, "carNumber" character varying NOT NULL, "driverName" character varying NOT NULL, "driverPhone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d7f0cf291bf98aaea42f73ad92" ON "mvd"."ticket" ("ticket_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "mvd"."passenger" ("id" SERIAL NOT NULL, "ticket_id" integer NOT NULL, "surname" character varying NOT NULL, "name" character varying NOT NULL, "patronymic" character varying, "birthday" character varying, "gender" character varying, "country" character varying, "documentType" character varying, "documentNumber" character varying, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2f0446396a794ee8b9e893af74" ON "mvd"."passenger" ("ticket_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "mvd"."tickets_log" ("id" SERIAL NOT NULL, "ticket_id" integer NOT NULL, "field" character varying NOT NULL, "old_value" character varying NOT NULL, "new_value" character varying NOT NULL, "changed_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_64ecda5e6f835c0fdd2e6fe1e34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mvd"."trace" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_d55e3146ed1a9769069a83a8044" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mvd"."user" ("id" SERIAL NOT NULL, "ory" json NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION log_update_changes()
      RETURNS TRIGGER AS $$
      DECLARE
          column_n text;
      BEGIN
          -- Найдем название поля, в котором произошли изменения
          FOR column_n IN SELECT column_name FROM information_schema.columns WHERE table_name = TG_TABLE_NAME LOOP
              IF row_to_json(OLD) ->> column_n IS DISTINCT FROM row_to_json(NEW) ->> column_n THEN
                  INSERT INTO mvd.tickets_log (ticket_id, field, old_value, new_value, changed_at)
                  VALUES (OLD.ticket_id, column_n, row_to_json(OLD) -> column_n, row_to_json(NEW) -> column_n, CURRENT_TIMESTAMP);
              END IF;
          END LOOP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;`);

    await queryRunner.query(`
      CREATE TRIGGER ticket_update_changes
      AFTER UPDATE ON mvd.ticket
      FOR EACH ROW
      EXECUTE FUNCTION log_update_changes();`);

    await queryRunner.query(`
      CREATE TRIGGER passenger_update_changes
      AFTER UPDATE ON mvd.passenger
      FOR EACH ROW
      EXECUTE FUNCTION log_update_changes();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mvd"."user"`);
    await queryRunner.query(`DROP TABLE "mvd"."trace"`);
    await queryRunner.query(`DROP TABLE "mvd"."tickets_log"`);
    await queryRunner.query(
      `DROP INDEX "mvd"."IDX_2f0446396a794ee8b9e893af74"`,
    );
    await queryRunner.query(`DROP TABLE "mvd"."passenger"`);
    await queryRunner.query(
      `DROP INDEX "mvd"."IDX_d7f0cf291bf98aaea42f73ad92"`,
    );
    await queryRunner.query(`DROP TABLE "mvd"."ticket"`);
  }
}
