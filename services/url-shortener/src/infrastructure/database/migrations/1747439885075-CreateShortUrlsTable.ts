import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateShortUrlsTable1747439885075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.createTable(
      new Table({
        name: 'short_urls',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'original_url',
            type: 'varchar',
          },
          {
            name: 'short_code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'click_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'short_urls',
      new TableIndex({
        name: 'IDX_SHORT_URLS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'short_urls',
      new TableIndex({
        name: 'IDX_SHORT_URLS_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );

    await queryRunner.createIndex(
      'short_urls',
      new TableIndex({
        name: 'IDX_SHORT_URLS_SHORT_CODE',
        columnNames: ['short_code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('short_urls', 'IDX_SHORT_URLS_SHORT_CODE');
    await queryRunner.dropIndex('short_urls', 'IDX_SHORT_URLS_CREATED_AT');
    await queryRunner.dropIndex('short_urls', 'IDX_SHORT_URLS_USER_ID');
    await queryRunner.dropTable('short_urls');
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
  }
}
