require "net/http"
require "uri"

class UrlMonitor < ApplicationRecord
  belongs_to :user
  has_many :checks, dependent: :destroy

  validates :url, presence: true
  validates :name, presence: true
  validates :check_interval, numericality: { greater_than_or_equal_to: 1 }

  enum status: { up: 0, down: 1 }

  after_create :schedule_checks

  def perform_check
    uri = URI.parse(url)
    start_time = Time.current

    response = nil
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
      request = Net::HTTP::Get.new(uri)
      response = http.request(request)
    end

    end_time = Time.current

    checks.create!(
      status_code: response.code.to_i,
      response_time: (end_time - start_time) * 1000,
      success: response.is_a?(Net::HTTPSuccess),
      checked_at: Time.current
    )

    update(
      status: response.is_a?(Net::HTTPSuccess) ? "up" : "down",
      last_checked_at: Time.current
    )
  rescue StandardError => e
    checks.create!(
      status_code: nil,
      response_time: nil,
      success: false,
      checked_at: Time.current,
      error_message: e.message
    )
    update(status: "down", last_checked_at: Time.current)
  end

  private

  def schedule_checks
    CheckUrlJob.perform_later(id)
  end
end
