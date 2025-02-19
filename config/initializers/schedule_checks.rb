Rails.application.config.after_initialize do
  UrlMonitor.find_each do |monitor|
    CheckUrlJob.perform_later(monitor.id)
  end
end
