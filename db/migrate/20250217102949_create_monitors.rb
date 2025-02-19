class CreateMonitors < ActiveRecord::Migration[7.2]
  def change
    create_table :monitors do |t|
      t.string :url
      t.string :name
      t.integer :check_interval
      t.string :status
      t.datetime :last_checked_at
      t.integer :user_id

      t.timestamps
    end
  end
end
