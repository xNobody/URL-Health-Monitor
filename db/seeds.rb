user = User.find_or_create_by(email: 'example_user@example.com') do |u|
  u.password = 'password'
end

url_monitors = UrlMonitor.create([
  { name: 'Example Monitor 1', url: 'http://example1.com', check_interval: 5, user: user },
  { name: 'Example Monitor 2', url: 'http://example2.com', check_interval: 10, user: user },
  { name: 'Google Monitor', url: 'http://google.com', check_interval: 5, user: user }
])

url_monitors.each do |monitor|
  if monitor.persisted?
    puts "Created URL monitor: #{monitor.name}"
    monitor.checks.create([
      { checked_at: Time.now - 1.hour, response_time: 200 },
      { checked_at: Time.now - 30.minutes, response_time: 250 }
    ])
  else
    puts "Failed to create URL monitor: #{monitor.errors.full_messages.join(', ')}"
  end
end
