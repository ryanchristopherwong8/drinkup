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
      #redirects to user profile page
      redirect_to user
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def delete
  end

  def destroy
    #helper method to logout user = sessions_helper.rb
    log_out
    redirect_to root_url
  end

end
