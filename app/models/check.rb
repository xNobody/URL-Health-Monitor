class Check < ApplicationRecord
  belongs_to :url_monitor

  validates :status_code, presence: true
  validates :response_time, presence: true
  validates :checked_at, presence: true
  validates :success, inclusion: { in: [ true, false ] }
end
