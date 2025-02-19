class AddUrlMonitorToChecks < ActiveRecord::Migration[7.2]
  def change
    add_reference :checks, :url_monitor, null: false, foreign_key: true
    add_column :checks, :error_message, :string
  end
end
