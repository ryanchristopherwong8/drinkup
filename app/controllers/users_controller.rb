#Controller for users, including user conversations, and user settings
class UsersController < ApplicationController
  #Security checks to ensure user has the rights to access pages 
  before_action :redirect_if_not_logged_in, :except => [:new, :create]
  before_action :correct_user, only: [:edit, :update, :delete, :destroy, :settings,
   :saveSettings, :saveConversations, :removeConversations, :removeImage]

  #User show page. Gets user and conversation parameters. 
  def show
    @user = User.find(params[:id])
    gon.user_id = @user.id
    gon.conversations = @user.conversations.select("name").map(&:name)
  end

  #Gets all conversation topics for display
  def getConversations
    @conversations = Conversation.all.select("name").map(&:name)

    respond_to do |format|
      format.json {render :json => {:conversations => @conversations}}
    end
  end

  #Saves conversations that the user has selected in their profile
  def saveConversations
    user = User.find(params[:id])
    conversation = Conversation.find_by_name(params[:conversation])

    userConversation = user.conversations.where(:name => conversation.name).first

    if userConversation.blank?
      user.conversations << conversation
      success = true
    else 
      success = false
    end

    respond_to do |format|
      format.json {render :json => {:success => success}}
    end
  end

  #Remove conversations from a user
  def removeConversations
    user = User.find(params[:id])
    conversation = Conversation.find_by_name(params[:conversation])

    userConversation = user.conversations.where(:name => conversation.name).first

    if !userConversation.blank?
      user.conversations.destroy(conversation)
      success = true
    else 
      success = false
    end

    respond_to do |format|
      format.json {render :json => {:success => success}}
    end
  end

  #Gets the events that a user is is attending for display
  def getCurrentEventsForUser
    events_currentUser = current_user.getEventsAttending
    gon.user_id = current_user.id

    respond_to do |format|
      format.json {render :json => {:events_currentUser => events_currentUser}}
    end
  end

  #Make a new user from signup page
  def new
  	@user = User.new
    @conversations = Conversation.all
  end

  #Get user info for edit page
  def edit
    @user = User.find(params[:id])
  end

  #Get user info for settings page
  def settings
    @user = User.find(params[:id])
  end

  #Save settings from the settings page. Saves new password.
  def saveSettings
    @user = User.find(params[:id])

    #Authenticate old entered password before changing to the new one
    if !@user.authenticate(params[:oldPassword])  
      flash[:danger] = "Old password is incorrect"
      redirect_to settings_user_path
    else
      if @user.update(user_settings_params)
        flash[:success] = "Password successfully changed"
        redirect_to settings_user_path
      else
        render 'settings'
      end
    end
  end

  #Create new user
  def create
    @user = User.new(user_params) 
    @loggedin = logged_in?  
    
    if @user.save
      #login user
      log_in @user
  	  #display successful login
      flash[:success] = "Welcome" + " "  + user_params[:first_name] + "!"
      #redirect to show by default
      redirect_to @user
    else
      render 'new'
    end
  end

  #Update user information
  def update
    @user = User.find(params[:id])
    
    if @user.update(user_params)
      flash[:success] = "Personal Information successfully updated"
      redirect_to @user
    else
      render 'edit'
    end
  end

  def delete
  end

  #Destroy user 
  def destroy
    @user = User.find(params[:id])
    #Get the events a user is part of to destroy their events too
    @events = @user.events.where("attendees.is_creator" => true)

    #This removes avatar from Amazon s3
    @user.avatar = nil
    @user.save

    log_out if logged_in?
    if @user.destroy
      @events.each do |event|
        event.update_attributes(:is_deleted => true)

        attendees_for_event = Attendee.where(:event_id => event.id)
        
        attendees_for_event.each do |attendee|
          attendee.update_attributes(:is_attending => false)
        end
      end
    end
    redirect_to root_path
  end

  #Remove image when a user just wants to remove image from their profile.
  def removeImage
    @user = User.find(params[:id])
    @user.avatar = nil      #This removes avatar from Amazon s3
    @user.save
    redirect_to edit_user_path
  end

  private
    def user_params
      #declaring strong paramters for profile page
      params.require(:user).permit(:first_name, :last_name, :date_of_birth, :email, :password, :password_confirmation, :avatar)
    end

    def user_settings_params
      #declaring strong paramters for settings page
      params.require(:user).permit(:password, :password_confirmation)
    end

    def correct_user 
      @user = User.find(params[:id])
      redirect_to @user unless current_user == @user
    end

end
