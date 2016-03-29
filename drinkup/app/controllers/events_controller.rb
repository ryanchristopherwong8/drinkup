class EventsController < ApplicationController

  before_action :redirect_if_not_logged_in
  
  def test
  end
  
  def index
  	@events = Event.all
  end

  def show
  	@event = Event.find(params[:id])
    attendee = @event.attendees.where(:user_id => current_user.id).first

    if !attendee.blank?
      @creator_status = attendee.is_creator
    else 
      @creator_status = false
    end
  end

  def new
  	@event = Event.new
  end

  def create
  	@event = Event.new(event_params)
    @user = current_user
 
  	if @event.save
      @attendee = Attendee.new
      @attendee.is_creator = true
      
      if @attendee.save
        @event.attendees << @attendee
        @user.attendees << @attendee
      end

  		redirect_to @event
  	else
  		render 'new'
  	end
  end

  def update
   @event = Event.find(params[:id])
 
   if @event.update(event_params)
    redirect_to @event
   else
    render 'edit'
   end
  end

  def edit
    @event = Event.find(params[:id])
  end

  def delete
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy

    attendees_for_event = Attendee.where(:event_id => @event.id)
    
    attendees_for_event.each do |attendee|
      attendee.destroy
    end

    redirect_to events_path
  end

  def join
    @event = Event.find(params[:id])
    @user = current_user

    @attendee = @event.attendees.where(:user_id => current_user.id).first

    if @attendee.blank?
      @attendee = Attendee.new
      @attendee.save

      @event.attendees << @attendee
      @user.attendees << @attendee
    end

    redirect_to @event
  end

  private
  def event_params
    params.require(:event).permit(:name, :lat, :lng, :start_time, :end_time, :gender)
  end
end
