module Api
  class SessionsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create]

    def create
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        token = encode_token({ user_id: user.id })
        pp "Login successful for user: #{user.email}" # Debugging line
        render json: { message: "Login successful", token: token, user_id: user.id }, status: :ok
      else
        pp "Login failed for email: #{params[:email]}" # Debugging line
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    def destroy
      # Handle logout if needed
    end

    private

    def encode_token(payload)
      JWT.encode(payload, Rails.application.credentials.secret_key_base)
    end
  end
end
