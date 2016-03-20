module SessionsHelper
  # Logs in the given user.
  def log_in(user)
  	#This places a temporary cookie on the user’s browser containing an encrypted version of the user’s id
  	#This session is separate from the controller session
    session[:user_id] = user.id

  end

   # Returns the current logged-in user (if any).
  def current_user
  	#the call to database is only called if current_user is not set
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # Returns true if the user is logged in, false otherwise.
  def logged_in?
    !current_user.nil?
  end

  # Logs out the current user.
  def log_out
    session.delete(:user_id)
    @current_user = nil
  end

end
