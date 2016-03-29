class Attendee < ActiveRecord::Base

	belongs_to :user
	belongs_to :event

	scope :user_attending, lambda {|user| where(:user_id => user.id).where(:is_attending => true) }
	scope :attending, lambda { where(:is_attending => true) }
end
