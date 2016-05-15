class Attendee < ActiveRecord::Base

	belongs_to :user
	belongs_to :event

	scope :attending, lambda { where(:is_attending => true) }
	scope :creator, lambda { where(:is_creator => true) }
	scope :attending_event, lambda {|event| where(:event_id => event.id, :is_attending => true) }
	scope :creator_of_event, lambda {|event| where(:event_id => event.id, :is_creator => true) }
	scope :is_creator_attending, lambda {|event| where(:event_id => event.id, :is_creator => true, :is_attending => true) }

end
