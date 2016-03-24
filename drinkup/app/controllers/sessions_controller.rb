class SessionsController < ApplicationController
  def index
  end

  def show
  end

  def new
  end

  def edit
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
      redirect_to user
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def delete
  end

  def destroy
    #Helper method to logout user = sessions_helper.rb
    #Fix bug = if user has multiple windows open and logs out of one and logs out of another. 
    #Make sure user is logged in before logging out
    log_out if logged_in?
    redirect_to root_url
  end

end
