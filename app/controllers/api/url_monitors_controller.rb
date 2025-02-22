module Api
  class UrlMonitorsController < ApplicationController
    before_action :set_monitor, only: %i[show update destroy history]

    def index
      if @current_user
        pp "Current user: #{@current_user.email}"
        @monitors = @current_user.url_monitors
        render json: @monitors
      else
        pp "No current user"
        render json: { error: "Not Authorized" }, status: 401
      end
    end

    def show
      render json: @monitor
    end

    def create
      @monitor = @current_user.url_monitors.new(monitor_params)
      if @monitor.save
        CheckUrlJob.perform_later(@monitor.id)
        render json: @monitor, status: :created
      else
        render json: @monitor.errors, status: :unprocessable_entity
      end
    end

    def update
      if @monitor.update(monitor_params)
        render json: @monitor
      else
        render json: @monitor.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @monitor.destroy
    end

    def history
      checks = @monitor.checks.order(checked_at: :asc)
      render json: checks
    end

    private

    def set_monitor
      @monitor = @current_user.url_monitors.find(params[:id])
    end

    def monitor_params
      params.require(:url_monitor).permit(:url, :name, :check_interval, :status, :last_checked_at)
    end
  end
end
