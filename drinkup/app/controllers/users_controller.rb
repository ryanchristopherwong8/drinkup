class UsersController < ApplicationController

  before_action :redirect_if_not_logged_in, :except => [:new, :create]

  def show
    @user = User.find(params[:id])
    gon.user_id = @user.id
    gon.conversations = @user.conversations.select("name").map(&:name)
  end

  def getConversations
    @conversations = Conversation.all.select("name").map(&:name)

    respond_to do |format|
      format.html
      format.json {render :json => {:conversations => @conversations}}
    end
  end

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

  def getCurrentEventsForUser
    events_currentUser = current_user.getEventsAttending
    gon.user_id = current_user.id

    respond_to do |format|
      format.json {render :json => {:events_currentUser => events_currentUser}}
    end
  end

  def new
  	@user = User.new
    @conversations = Conversation.all
  end

  def edit
    @user = User.find(params[:id])
    @conversations = Conversation.all
  end

  def create
    @user = User.new(user_params)   
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

  def update
    @user = User.find(params[:id])
   
    if @user.update(user_params)
      redirect_to @user
    else
      render 'edit'
    end
  end

  def delete
  end

  def destroy
    @user = User.find(params[:id])
    @user.avatar = nil
    @user.save

    log_out if logged_in?
    @user.destroy
 
    redirect_to root_path
  end

  

   private
    def user_params
      #declaring strong paramters
      params.require(:user).permit(:first_name, :last_name, :date_of_birth, :email, :password,
                                   :password_confirmation, :avatar)
    end

end
