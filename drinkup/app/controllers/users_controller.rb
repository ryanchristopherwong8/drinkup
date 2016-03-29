class UsersController < ApplicationController

  before_action :redirect_if_not_logged_in, :except => [:new, :create]

  def show
    @user = User.find(params[:id])
  end

  def new
  	@user = User.new
  end

  def edit
    @user = User.find(params[:id])
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
