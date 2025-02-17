class MonitorsController < ApplicationController
  before_action :set_monitor, only: [:show, :update, :destroy]

  def index
    @monitors = Monitor.all
    render json: @monitors
  end

  def show
    render json: @monitor
  end

  def create
    @monitor = Monitor.new(monitor_params)
    if @monitor.save
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
    head :no_content
  end

  private

  def set_monitor
    @monitor = Monitor.find(params[:id])
  end

  def monitor_params
    params.require(:monitor).permit(:url, :name, :check_interval, :status, :last_checked_at, :user_id)
  end
end