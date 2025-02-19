class CheckUrlJob < ApplicationJob
  queue_as :default

  def perform(monitor_id)
    monitor = UrlMonitor.find(monitor_id)
    monitor.perform_check

    # Reschedule the job based on the check_interval
    CheckUrlJob.set(wait: monitor.check_interval.minutes).perform_later(monitor.id)
  rescue StandardError => e
    monitor.checks.create!(
      success: false,
      checked_at: Time.current,
      error_message: e.message
    )
    monitor.update(status: "down", last_checked_at: Time.current)

    # Reschedule the job based on the check_interval
    CheckUrlJob.set(wait: monitor.check_interval.minutes).perform_later(monitor.id)
  end
end
