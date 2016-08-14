class SessionsController < ApplicationController

  before_action :redirect_if_not_logged_in, :except => [:index, :new, :create, :destroy]

  def index
    if logged_in?
      redirect_to(:controller => 'events', :action => 'index')
    end
  end

  def show
    redirect_to(:controller => 'events', :action => 'index')
  end

  def new
    if logged_in?
      redirect_to(:controller => 'events', :action => 'index')
    end
  end

  def edit
    redirect_to(:controller => 'events', :action => 'index')
  end

  def create

    #get user by email
    user = User.find_by(email: params[:session][:email].downcase)
    #checks if user exits and authtenticate checks encrypted password(has_password_validation)
    if user && user.authenticate(params[:session][:password])
      #helper method to login user = sessions_helper.rb
      log_in user
      #get rememeber me from form
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      #redirects to user profile page
      flash[:success] = "Welcome back" + " "  + user.first_name + "!"
      redirect_to events_path
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def delete
    if logged_in?
      redirect_to(:controller => 'events', :action => 'index')
    end
  end

  def destroy
    #Helper method to logout user = sessions_helper.rb
    #Fix bug = if user has multiple windows open and logs out of one and logs out of another. 
    #Make sure user is logged in before logging out
    log_out if logged_in?
    redirect_to '/login'
  end

end
