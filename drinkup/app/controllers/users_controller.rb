class UsersController < ApplicationController
	
  def show
    @user = User.find(params[:id])
  end

  def new
  	@user = User.new
  end

  def create
    @user = User.new(user_params)   
    if @user.save
      flash.now[:success] = "Welcome to the Sample App!"
      #redirect to show by default
      redirect_to @user
    else
      render 'new'
    end
  end

   private
    def user_params
      #declaring strong paramters
      params.require(:user).permit(:first_name, :last_name, :date_of_birth, :email, :password,
                                   :password_confirmation)
    end

end
