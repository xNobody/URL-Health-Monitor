module Api
  class UrlMonitorsController < ApplicationController
    before_action :set_monitor, only: %i[show update destroy]

    def index
      @monitors = UrlMonitor.all
      render json: @monitors
    end

    def show
      render json: @monitor
    end

    def create
      @monitor = UrlMonitor.new(monitor_params)
      if @monitor.save
        CheckUrlJob.perform_later(@monitor.id) # Schedule the job to run immediately
        render json: @monitor, status: :created
      else
        pp @monitor.errors.full_messages.join(", ")
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

    private

    def set_monitor
      @monitor = UrlMonitor.find(params[:id])
    end

    def monitor_params
      params.require(:url_monitor).permit(:url, :name, :check_interval, :status, :last_checked_at, :user_id)
    end
  end
end
