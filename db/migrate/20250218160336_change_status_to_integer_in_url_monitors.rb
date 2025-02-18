class ChangeStatusToIntegerInUrlMonitors < ActiveRecord::Migration[7.2]
  def change
    change_column :url_monitors, :status, 'integer USING CAST(status AS integer)'
  end
end
