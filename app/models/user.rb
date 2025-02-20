class User < ApplicationRecord
  has_secure_password
  has_many :url_monitors, dependent: :destroy
end
