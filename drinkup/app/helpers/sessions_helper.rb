module SessionsHelper
  # Logs in the given user.
  def log_in(user)
  	#This places a temporary cookie on the user’s browser containing an encrypted version of the user’s id
  	#This session is separate from the controller session
  	#session[:user_id] is only set when a user logs in (correct user and password), will not compromise application if hijacked
  	#user id is stored in plain text
    session[:user_id] = user.id

  end

  # Remembers a user in a persistent session.
  def remember(user)
  	#generates and stores encrypted password
    user.remember
    #signed = encrypts cookie
    #permanent = stores forever (20years)
    cookies.permanent.signed[:user_id] = user.id
    #remember token is just a random string(not encrypted)
    cookies.permanent[:remember_token] = user.remember_token
  end

  # Returns the user corresponding to the remember token cookie.
  def current_user
  	# if there is a user_id gets assigned, trick to reduce code
    if (user_id = session[:user_id])
      #find user only if doesnt exit 
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  # If user is logged in than return true
  def logged_in?
    !current_user.nil?
  end

  # Forgets cookie
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # Logs out the current user.
  def log_out
  	#forget cookie
  	forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end

end
