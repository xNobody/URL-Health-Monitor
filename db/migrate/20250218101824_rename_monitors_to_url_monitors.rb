class RenameMonitorsToUrlMonitors < ActiveRecord::Migration[7.2]
  def change
    rename_table :monitors, :url_monitors
  end
end
