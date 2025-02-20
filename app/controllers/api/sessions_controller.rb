module Api
  class SessionsController < ApplicationController
    skip_before_action :authenticate_request, only: [ :create ]

    def create
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        pp "Login successful for user: #{user.email}" # Debugging line
        render json: { message: "Login successful", user_id: user.id }, status: :ok
      else
        pp "Login failed for email: #{params[:email]}" # Debugging line
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    def destroy
      # Handle logout if needed
    end
  end
end
