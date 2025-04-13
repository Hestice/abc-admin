import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateScheduleDates1744538000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get all existing schedules
    const schedules = await queryRunner.query(`
      SELECT id, "day0Date" FROM schedules
    `);

    for (const schedule of schedules) {
      if (schedule.day0Date) {
        // Handle day0Date properly without timezone issues
        // Extract only the date portion from the raw database value
        let day0DateStr = schedule.day0Date;
        if (day0DateStr instanceof Date) {
          day0DateStr = day0DateStr.toISOString().split('T')[0];
        } else if (
          typeof day0DateStr === 'string' &&
          day0DateStr.includes('T')
        ) {
          day0DateStr = day0DateStr.split('T')[0];
        }

        // Create a clean date object from the date string
        const day0Date = new Date(day0DateStr);

        // Calculate the new dates
        const day3Date = new Date(day0DateStr);
        day3Date.setDate(day0Date.getDate() + 3);

        const day7Date = new Date(day0DateStr);
        day7Date.setDate(day0Date.getDate() + 7);

        const day28Date = new Date(day0DateStr);
        day28Date.setDate(day0Date.getDate() + 28);

        // Format dates for SQL as YYYY-MM-DD to avoid timezone issues
        const day3DateStr = day3Date.toISOString().split('T')[0];
        const day7DateStr = day7Date.toISOString().split('T')[0];
        const day28DateStr = day28Date.toISOString().split('T')[0];

        // Update the schedule with the corrected dates
        await queryRunner.query(
          `
          UPDATE schedules 
          SET 
            "day3Date" = $1,
            "day7Date" = $2,
            "day28Date" = $3
          WHERE id = $4
        `,
          [day3DateStr, day7DateStr, day28DateStr, schedule.id]
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to revert as we're just fixing data
  }
}
