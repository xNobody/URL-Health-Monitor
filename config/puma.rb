# This configuration file will be evaluated by Puma. The top-level methods that
# are invoked here are part of Puma's configuration DSL. For more information
# about methods provided by the DSL, see https://puma.io/puma/Puma/DSL.html.

# threads_count = ENV.fetch("RAILS_MAX_THREADS", 3)
# threads threads_count, threads_count

# port ENV.fetch("PORT", 3000)

# # Allow puma to be restarted by `bin/rails restart` command.
# plugin :tmp_restart

# pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

# if ENV.fetch("RAILS_ENV") == "development"
#   ssl_bind "0.0.0.0", "3000", {
#     key: "#{Rails.root}/config/ssl/localhost.key",
#     cert: "#{Rails.root}/config/ssl/localhost.crt",
#     verify_mode: "none"
#   }
# end

# # Bind SSL only for port 3001
# if ENV.fetch("RAILS_ENV") == "development"
#   ssl_bind "127.0.0.1", "3001", {
#     key: "#{Rails.root}/config/ssl/localhost.key",
#     cert: "#{Rails.root}/config/ssl/localhost.crt",
#     verify_mode: "none"
#   }
# end

threads_count = ENV.fetch("RAILS_MAX_THREADS", 3)
threads threads_count, threads_count

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart

pidfile ENV["PIDFILE"] if ENV["PIDFILE"]

if ENV.fetch("RAILS_ENV") == "development"
  # Bind SSL for port 3000
  ssl_bind "0.0.0.0", "3000", {
    key: "/rails/config/ssl/localhost.key",
    cert: "/rails/config/ssl/localhost.crt",
    verify_mode: "none"
  }

  # Bind SSL for port 3001
  ssl_bind "127.0.0.1", "3001", {
    key: "#{Rails.root}/config/ssl/localhost.key",
    cert: "#{Rails.root}/config/ssl/localhost.crt",
    verify_mode: "none"
  }
end
