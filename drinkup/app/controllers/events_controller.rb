class EventsController < ApplicationController

  before_action :redirect_if_not_logged_in
  before_filter :set_cache_headers
  
  def test
  end
  
  def index
  	@events = Event.all
    @events_attending = []

    current_user.events.each do |event|
      if !event.attendees.attending.first.blank?
        @events_attending << event.id
      end
    end
  end

  def show
  	@event = Event.find(params[:id])
    attendee = @event.attendees.user_attending(current_user).first
    @creator_status = false

    if !attendee.blank?
      @creator_status = attendee.is_creator
    end
  end

  def new
  	@event = Event.new
  end

  def create
  	@event = Event.new(event_params)
    @user = current_user
 
  	if @event.save
      # @attendee = Attendee.new
      # @attendee.is_creator = true
      # @attendee.is_attending = true
      
      # if @attendee.save
      #   @event.attendees << @attendee
      #   @user.attendees << @attendee
      # end

      @user.attendees.create(:event => @event, :is_attending => true, :is_creator => true)

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

    @attendee = @event.attendees.user_attending(@user).first

    if @attendee.blank?
      # @attendee = Attendee.new
      # @attendee.is_attending = true
      # @attendee.save

      # @event.attendees << @attendee
      # @user.attendees << @attendee

      @user.attendees.create(:event => @event, :is_attending => true)

    else
      @attendee.update_attributes(:is_attending => true)
    end

    redirect_to @event
  end

  def unjoin
    @event = Event.find(params[:id])
    @user = current_user

    @attendee = @event.attendees.user_attending(@user).first

    if @attendee.update_attributes(:is_attending => false)
      redirect_to @event
    else
      render('index')
    end
  end

  private
  def event_params
    params.require(:event).permit(:name, :lat, :lng, :start_time, :end_time, :gender)
  end
end
