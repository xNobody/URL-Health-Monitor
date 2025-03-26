namespace :db do
  desc "Drop the database after terminating connections"
  task drop_with_terminate: :environment do
    ActiveRecord::Base.connection.execute("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = 'url_health_monitor_development' AND pid <> pg_backend_pid();")
    Rake::Task["db:drop"].invoke
  end

  desc "Reset the database after terminating connections"
  task reset_with_terminate: :environment do
    ActiveRecord::Base.connection.execute("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = 'url_health_monitor_development' AND pid <> pg_backend_pid();")
    Rake::Task["db:reset"].invoke
  end
end
