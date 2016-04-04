class MessagesController < ApplicationController
  before_action :redirect_if_not_logged_in

  def create
    @chat = Chat.find(params[:chat_id])
    @message = @chat.messages.build(message_params)
    @message.user_id = current_user.id
    @message.save
    @path = chat_path(@chat)
    @current_user_id = current_user.id
  end

  private
  def message_params
    params.require(:message).permit(:body)
  end
end
