class UrlMonitor < ApplicationRecord
  belongs_to :user
  has_many :checks

  validates :url, presence: true
  validates :name, presence: true
  validates :check_interval, numericality: { greater_than_or_equal_to: 5 }
end
