class ApplicationController < ActionController::API
  before_action :authenticate_request

  private

  def authenticate_request
    @current_user = User.find_by(id: request.headers['X-User-ID'])
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end
