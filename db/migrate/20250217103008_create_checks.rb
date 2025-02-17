class CreateChecks < ActiveRecord::Migration[7.2]
  def change
    create_table :checks do |t|
      t.integer :monitor_id
      t.integer :status_code
      t.float :response_time
      t.datetime :checked_at
      t.boolean :success

      t.timestamps
    end
  end
end
