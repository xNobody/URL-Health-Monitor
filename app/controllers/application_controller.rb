class ApplicationController < ActionController::API
  before_action :authenticate_request

  private

  def authenticate_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header
    decoded = decode_token(header)
    @current_user = User.find(decoded["user_id"]) if decoded
    if @current_user
      pp "Authenticated user: #{@current_user.email}"
    else
      pp "Authentication failed"
      render json: { error: "Not Authorized" }, status: 401
    end
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
  rescue
    nil
  end
end
