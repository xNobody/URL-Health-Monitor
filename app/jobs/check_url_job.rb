class CheckUrlJob < ApplicationJob
  queue_as :default

  def perform(monitor_id)
    monitor = Monitor.find(monitor_id)
    start_time = Time.current
    response = HTTParty.get(monitor.url)
    end_time = Time.current

    monitor.checks.create!(
      status_code: response.code,
      response_time: (end_time - start_time) * 1000,
      success: response.success?,
      checked_at: Time.current
    )

    monitor.update(
      status: response.success? ? 'up' : 'down',
      last_checked_at: Time.current
    )
  rescue StandardError => e
    monitor.checks.create!(
      success: false,
      checked_at: Time.current,
      error_message: e.message
    )
    monitor.update(status: 'down', last_checked_at: Time.current)
  end
end